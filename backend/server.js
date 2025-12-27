// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import Stripe from "stripe";
import mongoose from "mongoose";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import Joi from "joi";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// --- Stripe setup ---
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// --- Mongoose setup ---
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/nilta-fixed";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
  });

// --- ESM __dirname helper ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Simple in-memory product catalog (CAD, amounts in cents)
// unitAmount = price per m² in CAD * 100
const PRODUCT_CATALOG = {
  "tile-01": {
    name: "Ceramic Floor Tile – Light Grey",
    unitAmount: 349, // 3.49 CAD / m²
  },
  "tile-02": {
    name: "Porcelain Tile – Concrete Look",
    unitAmount: 429, // 4.29 CAD / m²
  },
  "lam-01": {
    name: "Oak Laminate – Natural",
    unitAmount: 299, // 2.99 CAD / m²
  },
  "lam-02": {
    name: "Walnut Laminate – Dark",
    unitAmount: 319, // 3.19 CAD / m²
  },
  "hard-01": {
    name: "Engineered Hardwood – Smoked Oak",
    unitAmount: 899, // 8.99 CAD / m²
  },
  "hard-02": {
    name: "Engineered Hardwood – Natural Oak",
    unitAmount: 849, // 8.49 CAD / m²
  },
};

// --- Email helper ---
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST, // e.g. "smtp.gmail.com"
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true", // true for 465, false for 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://nilta-flooring-41kr.vercel.app",
    ],
    credentials: true,
  })
);

// Security middleware
app.use(helmet());

// Basic API rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
});
app.use("/api", apiLimiter);

// Static files for uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// --- STRIPE WEBHOOK (must come BEFORE express.json) ---
app.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      const email = session.customer_details?.email;
      const name = session.customer_details?.name || "Customer";
      const address = session.customer_details?.address;

      // Format shipping address nicely for HTML
      const formattedAddress = address
        ? `
      ${address.line1 || ""}${address.line2 ? ", " + address.line2 : ""}<br/>
      ${address.city || ""}${address.state ? ", " + address.state : ""} ${
            address.postal_code || ""
          }<br/>
      ${address.country || ""}
    `
        : "No address available";

      // Items saved as metadata JSON from /api/create-checkout-session
      let items = [];
      const metadataItems = session.metadata?.items;
      if (metadataItems) {
        try {
          const parsed = JSON.parse(metadataItems);
          if (Array.isArray(parsed)) {
            items = parsed;
          }
        } catch (e) {
          console.error("Failed to parse metadata items JSON:", e.message);
        }
      }

      const transporter = createTransporter();

      // Build rows with qty, unit price and line total
      let subtotal = 0;

      const itemsRowsHtml = items
        .map((item, index) => {
          const product = PRODUCT_CATALOG[item.id];
          const label = product?.name || item.id;
          const unitAmountCents = product?.unitAmount ?? 0;
          const unitPrice = unitAmountCents / 100;
          const qty = item.qty || 1;
          const lineTotal = unitPrice * qty;

          subtotal += lineTotal;

          return `
        <tr>
          <td style="padding:4px 8px;border:1px solid #ddd;">${index + 1}</td>
          <td style="padding:4px 8px;border:1px solid #ddd;">${label}</td>
          <td style="padding:4px 8px;border:1px solid #ddd;text-align:right;">${qty}</td>
          <td style="padding:4px 8px;border:1px solid #ddd;text-align:right;">$${unitPrice.toFixed(
            2
          )}</td>
          <td style="padding:4px 8px;border:1px solid #ddd;text-align:right;">$${lineTotal.toFixed(
            2
          )}</td>
        </tr>
      `;
        })
        .join("");

      const amountTotal = (session.amount_total || 0) / 100;
      const taxAmount = (session.total_details?.amount_tax || 0) / 100;

      const adminHtml = `
    <h2>New paid order from Store</h2>
    <p>A new order has been completed via Stripe Checkout.</p>

    <h3>Customer details</h3>
    <p><b>Name:</b> ${name}</p>
    <p><b>Email:</b> ${email || "-"}</p>

    <h3>Shipping address</h3>
    <p>${formattedAddress}</p>

    <h3>Ordered products</h3>
    <table style="border-collapse:collapse;border:1px solid #ddd;min-width:480px;">
      <thead>
        <tr>
          <th style="padding:4px 8px;border:1px solid #ddd;text-align:left;">#</th>
          <th style="padding:4px 8px;border:1px solid #ddd;text-align:left;">Product</th>
          <th style="padding:4px 8px;border:1px solid #ddd;text-align:right;">Qty</th>
          <th style="padding:4px 8px;border:1px solid #ddd;text-align:right;">Unit price (CAD)</th>
          <th style="padding:4px 8px;border:1px solid #ddd;text-align:right;">Line total (CAD)</th>
        </tr>
      </thead>
      <tbody>
        ${
          itemsRowsHtml ||
          `
          <tr>
            <td colspan="5" style="padding:4px 8px;border:1px solid #ddd;">No item details found in metadata.</td>
          </tr>
        `
        }
      </tbody>
    </table>

    <p><b>Subtotal (products only):</b> $${subtotal.toFixed(2)} CAD</p>
    <p><b>Tax (from Stripe):</b> $${taxAmount.toFixed(2)} CAD</p>
    <p><b>Total charged (from Stripe):</b> $${amountTotal.toFixed(2)} CAD</p>

    <p style="margin-top:16px;">
      This order was paid in full through Stripe. Please follow up with the customer to confirm
      delivery and installation details.
    </p>
  `;

      try {
        await transporter.sendMail({
          from: `"Nilta Flooring Store" <${
            process.env.SMTP_FROM || process.env.SMTP_USER
          }>`,
          to: process.env.CONTACT_TO,
          subject: `New paid order - ${name}`,
          replyTo: email || undefined,
          html: adminHtml,
        });
      } catch (e) {
        console.error("Failed to send admin order email:", e.message);
      }

      if (email) {
        const itemsListHtml = items
          .map((item) => {
            const product = PRODUCT_CATALOG[item.id];
            const label = product?.name || item.id;
            const qty = item.qty || 1;
            return `<li>${qty} × ${label}</li>`;
          })
          .join("");

        const customerHtml = `
      <h2>Order Confirmation – Nilta Flooring</h2>
      <p>Dear ${name},</p>
      <p>Thank you for your order with Nilta Flooring. We have received your payment and your order is now being processed.</p>
      <p><b>Summary of your order:</b></p>
      <ul>
        ${itemsListHtml || "<li>Your selected flooring products</li>"}
      </ul>
      <p>The total amount charged was <b>$${amountTotal.toFixed(
        2
      )} CAD</b>, including applicable taxes.</p>
      <p>Our team will contact you shortly to confirm delivery and installation details.</p>
      <p>If you have any questions, please feel free to reply to this email.</p>
      <p>Kind regards,<br/>Nilta Flooring</p>
    `;

        try {
          await transporter.sendMail({
            from: `"Nilta Flooring" <${
              process.env.SMTP_FROM || process.env.SMTP_USER
            }>`,
            to: email,
            subject: "Your order has been received – Nilta Flooring",
            html: customerHtml,
          });
        } catch (e) {
          console.error(
            "Failed to send customer order confirmation email:",
            e.message
          );
        }
      }
    }

    res.json({ received: true });
  }
);

// After webhook:
app.use(express.json());

// --- Admin panel models (Mongoose) ---
const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },

    price: { type: Number, required: true, min: 0 },
    salePrice: { type: Number, min: 0 },

    stock: { type: Number, required: true, min: 0 },
    sku: { type: String, unique: true, sparse: true },

    category: {
      type: String,
      enum: [
        "Residential",
        "Kitchen",
        "Bathroom",
        "Living Room",
        "Basement",
        "Exterior",
        "Commercial",
        "Tile",
        "Laminate",
        "Hardwood",
        "Other",
      ],
      default: "Other",
    },

    mainImage: { type: String },
    images: [{ type: String }],

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    email: { type: String, lowercase: true, trim: true },
    phone: { type: String },
  },
  { timestamps: true }
);

const adminUserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
  },
  { timestamps: true }
);

const galleryImageSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    category: {
      type: String,
      enum: [
        "Residential",
        "Kitchen",
        "Bathroom",
        "Living Room",
        "Basement",
        "Exterior",
        "Commercial",
      ],
      required: true,
    },
  },
  { timestamps: true }
);

const GalleryImage = mongoose.model("GalleryImage", galleryImageSchema);
const Product = mongoose.model("Product", productSchema);
const Customer = mongoose.model("Customer", customerSchema);
const AdminUser = mongoose.model("AdminUser", adminUserSchema);

// --- Admin auth helpers ---
const adminLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

function generateAdminToken(admin) {
  return jwt.sign(
    { id: admin._id, role: "admin" },
    process.env.JWT_SECRET || "dev-secret-change-me",
    { expiresIn: process.env.JWT_EXPIRES_IN || "8h" }
  );
}

function requireAdmin(req, res, next) {
  const header = req.headers.authorization;
  if (!header) {
    return res.status(401).json({ message: "Missing Authorization header" });
  }

  const [type, token] = header.split(" ");
  if (type !== "Bearer" || !token) {
    return res.status(401).json({ message: "Invalid Authorization format" });
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET || "dev-secret-change-me"
    );
    if (payload.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: admin only" });
    }
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// --- Multer config for product images ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

function imageFileFilter(req, file, cb) {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed"), false);
  }
  cb(null, true);
}

const upload = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// --- Admin routes ---

// Login
app.post("/api/admin/login", async (req, res) => {
  try {
    const { error, value } = adminLoginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const { email, password } = value;

    const admin = await AdminUser.findOne({ email });
    if (!admin) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = generateAdminToken(admin);
    res.json({ token });
  } catch (err) {
    console.error("Error in /api/admin/login:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// CRUD products
app.get("/api/admin/products", requireAdmin, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error("Error in GET /api/admin/products:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ CREATE product (supports multipart/form-data with optional image)
app.post(
  "/api/admin/products",
  requireAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      const { name, description, price, stock, sku, isActive, category } =
        req.body;

      if (!name || price == null || stock == null) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const normalizedSku =
        typeof sku === "string" && sku.trim().length > 0 ? sku.trim() : undefined;

      const parsedPrice = Number(price);
      const parsedStock = Number(stock);
      if (Number.isNaN(parsedPrice) || Number.isNaN(parsedStock)) {
        return res.status(400).json({ message: "Price/stock must be numbers" });
      }

      let mainImage;
      let images = [];

      if (req.file) {
        const imageUrl = `/uploads/${req.file.filename}`;
        mainImage = imageUrl;
        images = [imageUrl];
      }

      const product = await Product.create({
        name: String(name).trim(),
        description: description || "",
        price: parsedPrice,
        stock: parsedStock,
        sku: normalizedSku,
        isActive: isActive === "true" || isActive === true,
        category: category || "Other",
        mainImage,
        images,
      });

      res.status(201).json(product);
    } catch (err) {
      console.error("Error in POST /api/admin/products:", err);

      if (err.code === 11000 && err.keyPattern?.sku) {
        return res.status(400).json({ message: "SKU already exists" });
      }
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
      }

      res.status(500).json({ message: "Server error" });
    }
  }
);

// ✅ UPDATE product (supports multipart/form-data with optional image)
app.put(
  "/api/admin/products/:id",
  requireAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const updates = { ...req.body };

      if (updates.price != null) {
        const p = Number(updates.price);
        if (Number.isNaN(p)) {
          return res.status(400).json({ message: "Price must be a number" });
        }
        updates.price = p;
      }

      if (updates.stock != null) {
        const s = Number(updates.stock);
        if (Number.isNaN(s)) {
          return res.status(400).json({ message: "Stock must be a number" });
        }
        updates.stock = s;
      }

      if (typeof updates.isActive === "string") {
        updates.isActive = updates.isActive === "true";
      }

      if (typeof updates.sku === "string") {
        updates.sku = updates.sku.trim();
        if (!updates.sku) updates.sku = undefined;
      }

      if (req.file) {
        const imageUrl = `/uploads/${req.file.filename}`;
        updates.mainImage = imageUrl;
        updates.images = [imageUrl];
      }

      const product = await Product.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      });

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json(product);
    } catch (err) {
      console.error("Error in PUT /api/admin/products/:id:", err);

      if (err.code === 11000 && err.keyPattern?.sku) {
        return res.status(400).json({ message: "SKU already exists" });
      }
      if (err.name === "ValidationError") {
        return res.status(400).json({ message: err.message });
      }

      res.status(500).json({ message: "Server error" });
    }
  }
);

app.delete("/api/admin/products/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(204).end();
  } catch (err) {
    console.error("Error in DELETE /api/admin/products/:id:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Upload product image (legacy endpoint - still works, also sets mainImage)
app.post(
  "/api/admin/products/:id/images",
  requireAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      const { id } = req.params;
      if (!req.file) {
        return res.status(400).json({ message: "No image uploaded" });
      }

      const product = await Product.findById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      const imageUrl = `/uploads/${req.file.filename}`;

      product.mainImage = product.mainImage || imageUrl;
      product.images = [imageUrl, ...(product.images || [])];

      await product.save();
      res.json({ mainImage: product.mainImage, images: product.images });
    } catch (err) {
      console.error("Error in POST /api/admin/products/:id/images:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// List customers (read-only for now)
app.get("/api/admin/customers", requireAdmin, async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (err) {
    console.error("Error in GET /api/admin/customers:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Simple health check
app.get("/", (req, res) => {
  res.send("Nilta Flooring backend is running");
});

// ------------- CONTACT PAGE AUTOMATION -------------
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, phone, type, timeline, message } = req.body;

    if (!name || !email || !message) {
      return res
        .status(400)
        .json({ error: "Name, email and message are required." });
    }

    // Save/update customer in database
    try {
      await Customer.findOneAndUpdate(
        { email },
        { name, email, phone },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    } catch (err) {
      console.error("Failed to upsert customer from /api/contact:", err.message);
    }

    const transporter = createTransporter();

    // Email to admin
    const adminHtml = `
      <h2>New quote / contact request from website</h2>
      <p><b>Name:</b> ${name}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Phone:</b> ${phone || "-"} </p>
      <p><b>Project type:</b> ${type || "-"} </p>
      <p><b>Timeline:</b> ${timeline || "-"} </p>
      <p><b>Message:</b><br/>${(message || "").replace(/\n/g, "<br/>")}</p>
    `;

    await transporter.sendMail({
      from: `"Nilta Flooring Website" <${
        process.env.SMTP_FROM || process.env.SMTP_USER
      }>`,
      to: process.env.CONTACT_TO,
      subject: `New website quote request from ${name}`,
      replyTo: email,
      html: adminHtml,
    });

    // Formal confirmation to customer
    const customerHtml = `
      <h2>Quote Request Received – Nilta Flooring</h2>
      <p>Dear ${name},</p>
      <p>Thank you for reaching out to Nilta Flooring. We have received your request and our team will review the details of your project.</p>
      <p><b>Summary of your request:</b></p>
      <ul>
        <li><b>Project type:</b> ${type || "-"}</li>
        <li><b>Timeline:</b> ${timeline || "-"}</li>
        <li><b>Phone:</b> ${phone || "-"}</li>
      </ul>
      <p><b>Your message:</b></p>
      <p>${(message || "").replace(/\n/g, "<br/>")}</p>
      <p>We will contact you as soon as possible with more information and next steps.</p>
      <p>Kind regards,<br/>Nilta Flooring</p>
    `;

    await transporter.sendMail({
      from: `"Nilta Flooring" <${
        process.env.SMTP_FROM || process.env.SMTP_USER
      }>`,
      to: email,
      subject: "We have received your quote request – Nilta Flooring",
      html: customerHtml,
    });

    res.json({ ok: true });
  } catch (err) {
    console.error("Error in /api/contact:", err);
    res.status(500).json({ error: "Failed to send emails." });
  }
});

// ------------- STORE QUOTE (non-paid) – OPTIONAL -------------
app.post("/api/order", async (req, res) => {
  try {
    const body = req.body || {};
    const itemsRaw = Array.isArray(body.items) ? body.items : [];
    const customerRaw = body.customer || {};

    if (!itemsRaw || itemsRaw.length === 0) {
      return res.status(400).json({ error: "No items in order." });
    }

    // -------- Normalize customer --------
    const firstName = String(customerRaw.firstName || "").trim();
    const lastName = String(customerRaw.lastName || "").trim();

    const customerName =
      String(customerRaw.name || "").trim() ||
      `${firstName} ${lastName}`.trim() ||
      "Unknown";

    const customerEmail = String(customerRaw.email || "").trim();
    const customerPhone = String(customerRaw.phone || "").trim();
    const customerNotes = String(customerRaw.notes || "").trim();

    // Save/update customer in database (name/email/phone)
    if (customerEmail) {
      try {
        await Customer.findOneAndUpdate(
          { email: customerEmail },
          { name: customerName, email: customerEmail, phone: customerPhone },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      } catch (err) {
        console.error("Failed to upsert customer from /api/order:", err.message);
      }
    }

    // -------- Normalize items (support old + new payloads) --------
    const items = itemsRaw.map((it) => {
      const name = String(it.name || it.id || "Unknown product").trim();
      const description = String(it.description || "").trim();

      const qty = Number(it.qty ?? it.quantity ?? 0) || 0;

      // Allow optional pricing sent by frontend
      const unitPrice =
        typeof it.unitPrice === "number" ? it.unitPrice : null;

      const lineTotal =
        typeof it.lineTotal === "number"
          ? it.lineTotal
          : unitPrice !== null
          ? unitPrice * qty
          : null;

      return { name, description, qty, unitPrice, lineTotal };
    });

    // total (optional); if not provided, compute if possible
    const totalFromBody = typeof body.total === "number" ? body.total : null;
    const computedTotal = items.reduce(
      (sum, it) => sum + (it.lineTotal || 0),
      0
    );
    const total =
      totalFromBody !== null ? totalFromBody : computedTotal || null;

    const transporter = createTransporter();

    // -------- Email rows --------
    const itemsRowsHtml = items
      .map((item, index) => {
        const unit =
          item.unitPrice !== null ? `$${item.unitPrice.toFixed(2)}` : "-";
        const line =
          item.lineTotal !== null ? `$${item.lineTotal.toFixed(2)}` : "-";

        return `
          <tr>
            <td style="padding:6px 10px;border:1px solid #ddd;">${index + 1}</td>
            <td style="padding:6px 10px;border:1px solid #ddd;">
              <div style="font-weight:600;">${item.name}</div>
              ${
                item.description
                  ? `<div style="margin-top:4px;color:#666;font-size:12px;">${item.description}</div>`
                  : ""
              }
            </td>
            <td style="padding:6px 10px;border:1px solid #ddd;text-align:right;">${
              item.qty
            }</td>
            <td style="padding:6px 10px;border:1px solid #ddd;text-align:right;">${unit}</td>
            <td style="padding:6px 10px;border:1px solid #ddd;text-align:right;">${line}</td>
          </tr>
        `;
      })
      .join("");

    const adminHtml = `
      <h2>New quote request from Store (unpaid)</h2>

      <h3>Customer details</h3>
      <p><b>Name:</b> ${customerName}</p>
      <p><b>Email:</b> ${customerEmail || "-"}</p>
      <p><b>Phone:</b> ${customerPhone || "-"}</p>
      <p><b>Notes:</b><br/>${
        customerNotes ? customerNotes.replace(/\n/g, "<br/>") : "-"
      }</p>

      <h3>Requested products</h3>
      <table style="border-collapse:collapse;border:1px solid #ddd;min-width:560px;">
        <thead>
          <tr>
            <th style="padding:6px 10px;border:1px solid #ddd;text-align:left;">#</th>
            <th style="padding:6px 10px;border:1px solid #ddd;text-align:left;">Product</th>
            <th style="padding:6px 10px;border:1px solid #ddd;text-align:right;">Qty</th>
            <th style="padding:6px 10px;border:1px solid #ddd;text-align:right;">Unit price (CAD)</th>
            <th style="padding:6px 10px;border:1px solid #ddd;text-align:right;">Line total (CAD)</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRowsHtml}
        </tbody>
      </table>

      ${
        total !== null
          ? `<p style="margin-top:12px;"><b>Total (estimated):</b> $${total.toFixed(
              2
            )} CAD</p>`
          : `<p style="margin-top:12px;color:#666;"><i>Total not provided.</i></p>`
      }

      <p style="margin-top:12px;color:#666;font-size:12px;">
        Note: This is an unpaid quote request. Final pricing may change based on exact product specs, availability, measurements, and installation details.
      </p>
    `;

    await transporter.sendMail({
      from: `"Nilta Flooring Store" <${
        process.env.SMTP_FROM || process.env.SMTP_USER
      }>`,
      to: process.env.CONTACT_TO,
      subject: `New quote request from Store - ${customerName}`,
      replyTo: customerEmail || undefined,
      html: adminHtml,
    });

    // Customer confirmation email
    if (customerEmail) {
      const listHtml = items
        .map((it) => {
          const line =
            it.lineTotal !== null ? ` — $${it.lineTotal.toFixed(2)} CAD` : "";
          return `<li>${it.qty} × <b>${it.name}</b>${line}</li>`;
        })
        .join("");

      const confirmHtml = `
        <h2>Quote Request Received – Nilta Flooring</h2>
        <p>Dear ${customerName},</p>
        <p>Thank you for your interest in our flooring products. We have received your quote request with the following items:</p>
        <ul>
          ${listHtml}
        </ul>
        ${
          total !== null
            ? `<p><b>Estimated total:</b> $${total.toFixed(2)} CAD</p>`
            : ""
        }
        <p>We will review your request and contact you with pricing and availability.</p>
        <p>Kind regards,<br/>Nilta Flooring</p>
      `;

      await transporter.sendMail({
        from: `"Nilta Flooring" <${
          process.env.SMTP_FROM || process.env.SMTP_USER
        }>`,
        to: customerEmail,
        subject: "We have received your quote request – Nilta Flooring",
        html: confirmHtml,
      });
    }

    res.json({ ok: true });
  } catch (err) {
    console.error("Error in /api/order:", err);
    res.status(500).json({ error: "Failed to send order emails." });
  }
});

// ------------- STRIPE CHECKOUT (creates session) -------------
// ✅ Replace ONLY your /api/create-checkout-session route with this MongoDB version.
// It builds Stripe line_items from your Mongo Product collection (not PRODUCT_CATALOG).

app.post("/api/create-checkout-session", async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "No items provided" });
    }

    // Expect items like: [{ id: "<mongo_id>", qty: 2 }, ...]
    const ids = items.map((it) => String(it.id || "")).filter(Boolean);

    if (ids.length !== items.length) {
      return res.status(400).json({ error: "Each item must have an id" });
    }

    // Fetch active products from DB
    const products = await Product.find({
      _id: { $in: ids },
      isActive: true,
    });

    const byId = new Map(products.map((p) => [String(p._id), p]));

    // Build line_items for Stripe
    const line_items = items.map((it) => {
      const product = byId.get(String(it.id));
      if (!product) {
        throw new Error(`Unknown or inactive product: ${it.id}`);
      }

      const qty = Number(it.qty);
      if (!Number.isFinite(qty) || qty <= 0) {
        throw new Error(`Invalid qty for product ${it.id}`);
      }

      // IMPORTANT:
      // If your Mongo "price" is already in cents (e.g. 12312 means $123.12),
      // then use: const unit_amount = Number(product.price);
      //
      // If your Mongo "price" is in dollars (e.g. 123.12), then use:
      // const unit_amount = Math.round(Number(product.price) * 100);
      //
      // From your example "price": 12312 looks like cents, so we’ll treat it as cents:
      const unit_amount = Number(product.price);

      if (!Number.isFinite(unit_amount) || unit_amount < 0) {
        throw new Error(`Invalid price for product ${it.id}`);
      }

      return {
        price_data: {
          currency: "cad",
          unit_amount, // cents
          product_data: {
            name: product.name,
            description: product.description || undefined,
          },
        },
        quantity: qty,
      };
    });

    if (!process.env.CLIENT_URL) {
      throw new Error("Missing CLIENT_URL in .env");
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items,
      success_url: `${process.env.CLIENT_URL}/store?success=true`,
      cancel_url: `${process.env.CLIENT_URL}/store?canceled=true`,
      automatic_tax: { enabled: true },
      billing_address_collection: "required",
      shipping_address_collection: {
        allowed_countries: ["CA"],
      },
      metadata: {
        items: JSON.stringify(items),
      },
    });

    return res.json({ url: session.url });
  } catch (err) {
    console.error("Error creating checkout session:", err);
    return res.status(500).json({ error: err.message });
  }
});


/**
 * Public products endpoint for Store page
 * Returns active products for the storefront.
 */
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find({ isActive: true }).sort({
      createdAt: -1,
    });

    res.json(products);
  } catch (err) {
    console.error("Error in GET /api/products:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * Public gallery endpoint used by Residential / Commercial pages.
 * Optional query ?category=Residential|Kitchen|Bathroom|Basement|Exterior|Commercial
 */
app.get("/api/gallery", async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const images = await GalleryImage.find(filter).sort({ createdAt: -1 });
    res.json(images);
  } catch (err) {
    console.error("Error in GET /api/gallery:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
