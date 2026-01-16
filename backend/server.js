// backend/server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import mongoose from "mongoose";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import Joi from "joi";
import { v2 as cloudinary } from "cloudinary";
import mongoSanitize from "express-mongo-sanitize";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Important for correct IPs behind proxies (Hostinger/Cloudflare)
app.set("trust proxy", 1);

// --- Cloudinary setup ---
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Your requested folder paths:
const CLOUDINARY_PRODUCTS_FOLDER = "nilta/products";
const CLOUDINARY_GALLERY_FOLDER = "nilta/Gallery Photos";

async function uploadToCloudinary(file, folder) {
  if (!file?.buffer) throw new Error("Missing file buffer");

  const result = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: "image" },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    stream.end(file.buffer);
  });

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
}

async function safeDestroyCloudinary(publicId) {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: "image" });
  } catch (err) {
    console.error("Cloudinary destroy failed:", publicId, err?.message || err);
  }
}

// --- Mongoose setup ---
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/nilta-fixed";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err.message));

// --- Email helper (cached transporter) ---
let _transporter = null;

function getTransporter() {
  if (_transporter) return _transporter;

  _transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return _transporter;
}

// Escape user input for safe HTML emails
function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://nilta-flooring-41kr.vercel.app",
      "https://nilta.ca",
      "https://www.nilta.ca",
    ],
    credentials: true,
  })
);

// Helmet
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", apiLimiter);

// Stricter limiter for contact form (anti-spam)
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

// 🔐 Extra strict limiter just for admin login
const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 8,
  standardHeaders: true,
  legacyHeaders: false,
});

// JSON
app.use(express.json());

// NoSQL injection protection
app.use(
  mongoSanitize({
    replaceWith: "_",
  })
);

// --- Multer config (memory storage for Cloudinary) ---
function imageFileFilter(req, file, cb) {
  if (!file.mimetype.startsWith("image/")) {
    return cb(new Error("Only image files are allowed"), false);
  }
  cb(null, true);
}

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: imageFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

// --- Schemas / Models ---
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

    // Cloudinary
    mainImage: { type: String },
    images: [{ type: String }],
    mainImagePublicId: { type: String },
    imagePublicIds: [{ type: String }],

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const customerSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true },
    email: { type: String, lowercase: true, trim: true },
    phone: { type: String },

    // Optional (your UI shows address; safe to keep optional)
    address: {
      line1: String,
      line2: String,
      city: String,
      state: String,
      postalCode: String,
      country: String,
    },
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
    publicId: { type: String, required: true }, // needed for delete from Cloudinary
    category: {
      type: String,
      enum: [
        "Whole-House Flooring",
        "Kitchen Flooring",
        "Bathroom Tile & LVP",
        "Stairs & Transitions",
        "Basement Flooring", // REMOVE this line if you don’t want basement
        "Commercial",
      ],

      required: true,
    },
  },
  { timestamps: true }
);

const orderSchema = new mongoose.Schema(
  {
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer" },
    customer: {
      name: String,
      email: String,
      phone: String,
      notes: String,
    },
    items: [
      {
        name: String,
        description: String,
        quantity: Number,
        unitPrice: Number,
        lineTotal: Number,
      },
    ],
    total: Number,
    status: { type: String, default: "quote-request" },
    paymentStatus: { type: String, default: "unpaid" },
  },
  { timestamps: true }
);

const GalleryImage = mongoose.model("GalleryImage", galleryImageSchema);
const Product = mongoose.model("Product", productSchema);
const Customer = mongoose.model("Customer", customerSchema);
const AdminUser = mongoose.model("AdminUser", adminUserSchema);
const Order = mongoose.model("Order", orderSchema);

// --- Validation ---
const adminLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const contactSchema = Joi.object({
  name: Joi.string().trim().min(2).max(80).required(),
  email: Joi.string().trim().email().max(120).required(),
  phone: Joi.string().trim().allow("", null).max(40),
  type: Joi.string().trim().allow("", null).max(60),
  timeline: Joi.string().trim().allow("", null).max(60),
  message: Joi.string().trim().min(5).max(1000).required(),
});

// --- Auth helpers ---
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

// ------------------- ADMIN ROUTES -------------------

// Login
app.post("/api/admin/login", adminLoginLimiter, async (req, res) => {
  try {
    const { error, value } = adminLoginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { email, password } = value;

    const admin = await AdminUser.findOne({ email });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    const isValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isValid) return res.status(401).json({ message: "Invalid credentials" });

    const token = generateAdminToken(admin);
    res.json({ token });
  } catch (err) {
    console.error("Error in /api/admin/login:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Products
app.get("/api/admin/products", requireAdmin, async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error("Error in GET /api/admin/products:", err);
    res.status(500).json({ message: "Server error" });
  }
});

app.post(
  "/api/admin/products",
  requireAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      const { name, description, price, stock, sku, isActive, category } = req.body;

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
      let mainImagePublicId;
      let imagePublicIds = [];

      if (req.file) {
        const uploaded = await uploadToCloudinary(req.file, CLOUDINARY_PRODUCTS_FOLDER);
        mainImage = uploaded.url;
        images = [uploaded.url];
        mainImagePublicId = uploaded.publicId;
        imagePublicIds = [uploaded.publicId];
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
        mainImagePublicId,
        imagePublicIds,
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
        if (Number.isNaN(p)) return res.status(400).json({ message: "Price must be a number" });
        updates.price = p;
      }

      if (updates.stock != null) {
        const s = Number(updates.stock);
        if (Number.isNaN(s)) return res.status(400).json({ message: "Stock must be a number" });
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
        const uploaded = await uploadToCloudinary(req.file, CLOUDINARY_PRODUCTS_FOLDER);
        updates.mainImage = uploaded.url;
        updates.images = [uploaded.url];
        updates.mainImagePublicId = uploaded.publicId;
        updates.imagePublicIds = [uploaded.publicId];
      }

      const product = await Product.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      });

      if (!product) return res.status(404).json({ message: "Product not found" });
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

    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const ids = new Set();
    if (product.mainImagePublicId) ids.add(product.mainImagePublicId);
    if (Array.isArray(product.imagePublicIds)) {
      for (const pid of product.imagePublicIds) if (pid) ids.add(pid);
    }

    await Product.findByIdAndDelete(id);
    await Promise.all([...ids].map((pid) => safeDestroyCloudinary(pid)));

    res.status(204).end();
  } catch (err) {
    console.error("Error in DELETE /api/admin/products/:id:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Legacy product image upload (still works)
app.post(
  "/api/admin/products/:id/images",
  requireAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      const { id } = req.params;
      if (!req.file) return res.status(400).json({ message: "No image uploaded" });

      const product = await Product.findById(id);
      if (!product) return res.status(404).json({ message: "Product not found" });

      const uploaded = await uploadToCloudinary(req.file, CLOUDINARY_PRODUCTS_FOLDER);

      product.mainImage = product.mainImage || uploaded.url;
      product.images = [uploaded.url, ...(product.images || [])];

      product.mainImagePublicId = product.mainImagePublicId || uploaded.publicId;
      product.imagePublicIds = [uploaded.publicId, ...(product.imagePublicIds || [])];

      await product.save();
      res.json(product);
    } catch (err) {
      console.error("Error in POST /api/admin/products/:id/images:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// ✅ FIX #1: Admin Gallery endpoint (your frontend calls /api/admin/gallery)
app.get("/api/admin/gallery", requireAdmin, async (req, res) => {
  try {
    const { category } = req.query;

    const filter = category ? { category } : {};
    const images = await GalleryImage.find(filter).sort({ createdAt: -1 });

    res.json(images);
  } catch (err) {
    console.error("Error in GET /api/admin/gallery:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// Optional: upload a gallery image from admin (multipart/form-data: image + category)
app.post(
  "/api/admin/gallery",
  requireAdmin,
  upload.single("image"),
  async (req, res) => {
    try {
      const { category } = req.body;
      if (!category) return res.status(400).json({ message: "Category is required" });
      if (!req.file) return res.status(400).json({ message: "Image is required" });

      const uploaded = await uploadToCloudinary(req.file, CLOUDINARY_GALLERY_FOLDER);

      const img = await GalleryImage.create({
        url: uploaded.url,
        publicId: uploaded.publicId,
        category,
      });

      res.status(201).json(img);
    } catch (err) {
      console.error("Error in POST /api/admin/gallery:", err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Optional: delete gallery image (also deletes Cloudinary asset)
app.delete("/api/admin/gallery/:id", requireAdmin, async (req, res) => {
  try {
    const img = await GalleryImage.findById(req.params.id);
    if (!img) return res.status(404).json({ message: "Not found" });

    await GalleryImage.findByIdAndDelete(req.params.id);
    await safeDestroyCloudinary(img.publicId);

    res.status(204).end();
  } catch (err) {
    console.error("Error in DELETE /api/admin/gallery/:id:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ FIX #2: Customers list should include ordersCount + lastOrderDate (your UI expects them)
app.get("/api/admin/customers", requireAdmin, async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 }).lean();

    // Aggregate order stats per customerId
    const stats = await Order.aggregate([
      { $match: { customerId: { $ne: null } } },
      {
        $group: {
          _id: "$customerId",
          ordersCount: { $sum: 1 },
          lastOrderDate: { $max: "$createdAt" },
        },
      },
    ]);

    const statsMap = new Map(stats.map((s) => [String(s._id), s]));

    const withStats = customers.map((c) => {
      const s = statsMap.get(String(c._id));
      return {
        ...c,
        ordersCount: s?.ordersCount || 0,
        lastOrderDate: s?.lastOrderDate || null,
      };
    });

    res.json(withStats);
  } catch (err) {
    console.error("Error in GET /api/admin/customers:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ DELETE customer + all orders (CASCADE DELETE)
app.delete("/api/admin/customers/:id", requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    // 1) delete all orders for this customer
    await Order.deleteMany({ customerId: id });

    // 2) delete customer
    const deletedCustomer = await Customer.findByIdAndDelete(id);

    if (!deletedCustomer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    return res.status(204).end();
  } catch (err) {
    console.error("Error in DELETE /api/admin/customers/:id:", err);
    return res.status(500).json({ message: "Server error" });
  }
});


// ✅ FIX #2: Customer orders endpoint (your UI calls /api/admin/customers/:id/orders)
app.get("/api/admin/customers/:id/orders", requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.params.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Error in GET /api/admin/customers/:id/orders:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Optional: admin orders list
app.get("/api/admin/orders", requireAdmin, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("Error in GET /api/admin/orders:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ------------------- PUBLIC ROUTES -------------------

// health check
app.get("/", (req, res) => {
  res.send("Nilta Flooring backend is running");
});

// Contact (email)
app.post("/api/contact", contactLimiter, async (req, res) => {
  try {
    const { error, value } = contactSchema.validate(req.body, {
      abortEarly: true,
      stripUnknown: true,
    });

    if (error) return res.status(400).json({ error: error.details[0].message });

    const { name, email, phone, type, timeline, message } = value;

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

    const transporter = getTransporter();

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone || "-");
    const safeType = escapeHtml(type || "-");
    const safeTimeline = escapeHtml(timeline || "-");
    const safeMessage = escapeHtml(message || "").replace(/\n/g, "<br/>");

    const adminHtml = `
      <h2>New quote / contact request from website</h2>
      <p><b>Name:</b> ${safeName}</p>
      <p><b>Email:</b> ${safeEmail}</p>
      <p><b>Phone:</b> ${safePhone}</p>
      <p><b>Project type:</b> ${safeType}</p>
      <p><b>Timeline:</b> ${safeTimeline}</p>
      <p><b>Message:</b><br/>${safeMessage}</p>
    `;

    await transporter.sendMail({
      from: `"Nilta Flooring Website" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: process.env.CONTACT_TO,
      subject: `New website quote request from ${safeName}`,
      replyTo: email,
      html: adminHtml,
    });

    const customerHtml = `
      <h2>Quote Request Received – Nilta Flooring</h2>
      <p>Dear ${safeName},</p>
      <p>Thank you for reaching out to Nilta Flooring. We have received your request and our team will review the details of your project.</p>
      <p><b>Summary of your request:</b></p>
      <ul>
        <li><b>Project type:</b> ${safeType}</li>
        <li><b>Timeline:</b> ${safeTimeline}</li>
        <li><b>Phone:</b> ${safePhone}</li>
      </ul>
      <p><b>Your message:</b></p>
      <p>${safeMessage}</p>
      <p>We will contact you as soon as possible with more information and next steps.</p>
      <p>Kind regards,<br/>Nilta Flooring</p>
    `;

    await transporter.sendMail({
      from: `"Nilta Flooring" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: email,
      subject: "We have received your quote request – Nilta Flooring",
      html: customerHtml,
    });

    return res.json({ ok: true });
  } catch (err) {
    console.error("Error in /api/contact:", err);
    return res.status(500).json({ error: "Failed to send emails." });
  }
});

// Store quote / order (now SAVES to DB + emails)
app.post("/api/order", async (req, res) => {
  try {
    const body = req.body || {};
    const itemsRaw = Array.isArray(body.items) ? body.items : [];
    const customerRaw = body.customer || {};

    if (itemsRaw.length === 0) {
      return res.status(400).json({ error: "No items in order." });
    }

    // Normalize customer
    const firstName = String(customerRaw.firstName || "").trim();
    const lastName = String(customerRaw.lastName || "").trim();

    const customerName =
      String(customerRaw.name || "").trim() ||
      `${firstName} ${lastName}`.trim() ||
      "Unknown";

    const customerEmail = String(customerRaw.email || "").trim();
    const customerPhone = String(customerRaw.phone || "").trim();
    const customerNotes = String(customerRaw.notes || "").trim();

    // Upsert customer
    let customerDoc = null;
    if (customerEmail) {
      try {
        customerDoc = await Customer.findOneAndUpdate(
          { email: customerEmail },
          { name: customerName, email: customerEmail, phone: customerPhone },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      } catch (err) {
        console.error("Failed to upsert customer from /api/order:", err.message);
      }
    }

    // Normalize items (store quantity for your AdminCustomers UI)
    const items = itemsRaw.map((it) => {
      const name = String(it.name || it.id || "Unknown product").trim();
      const description = String(it.description || "").trim();

      const quantity = Number(it.quantity ?? it.qty ?? 0) || 0;

      const unitPrice = typeof it.unitPrice === "number" ? it.unitPrice : null;

      const lineTotal =
        typeof it.lineTotal === "number"
          ? it.lineTotal
          : unitPrice !== null
            ? unitPrice * quantity
            : null;

      return { name, description, quantity, unitPrice, lineTotal };
    });

    const totalFromBody = typeof body.total === "number" ? body.total : null;
    const computedTotal = items.reduce((sum, it) => sum + (it.lineTotal || 0), 0);
    const total = totalFromBody !== null ? totalFromBody : computedTotal || 0;

    // ✅ Save order to DB (this is what fixes "Failed to load orders")
    await Order.create({
      customerId: customerDoc?._id,
      customer: {
        name: customerName,
        email: customerEmail,
        phone: customerPhone,
        notes: customerNotes,
      },
      items,
      total,
      status: "quote-request",
      paymentStatus: "unpaid",
    });

    // Email
    const transporter = getTransporter();

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
              <div style="font-weight:600;">${escapeHtml(item.name)}</div>
              ${item.description
            ? `<div style="margin-top:4px;color:#666;font-size:12px;">${escapeHtml(
              item.description
            )}</div>`
            : ""
          }
            </td>
            <td style="padding:6px 10px;border:1px solid #ddd;text-align:right;">${item.quantity}</td>
            <td style="padding:6px 10px;border:1px solid #ddd;text-align:right;">${unit}</td>
            <td style="padding:6px 10px;border:1px solid #ddd;text-align:right;">${line}</td>
          </tr>
        `;
      })
      .join("");

    const adminHtml = `
      <h2>New quote request from Store (unpaid)</h2>

      <h3>Customer details</h3>
      <p><b>Name:</b> ${escapeHtml(customerName)}</p>
      <p><b>Email:</b> ${escapeHtml(customerEmail || "-")}</p>
      <p><b>Phone:</b> ${escapeHtml(customerPhone || "-")}</p>
      <p><b>Notes:</b><br/>${customerNotes ? escapeHtml(customerNotes).replace(/\n/g, "<br/>") : "-"
      }</p>

      <h3>Requested products</h3>
      <table style="border-collapse:collapse;border:1px solid #ddd;min-width:560px;">
        <thead>
          <tr>
            <th style="padding:6px 10px;border:1px solid #ddd;text-align:left;">#</th>
            <th style="padding:6px 10px;border:1px solid #ddd;text-align:left;">Product</th>
            <th style="padding:6px 10px;border:1px solid #ddd;text-align:right;">Qty</th>
            <th style="padding:6px 10px;border:1px solid #ddd;text-align:right;">Unit price</th>
            <th style="padding:6px 10px;border:1px solid #ddd;text-align:right;">Line total</th>
          </tr>
        </thead>
        <tbody>
          ${itemsRowsHtml}
        </tbody>
      </table>

      <p style="margin-top:12px;"><b>Total (estimated):</b> $${Number(total).toFixed(2)}</p>

      <p style="margin-top:12px;color:#666;font-size:12px;">
        Note: This is an unpaid quote request. Final pricing may change based on exact product specs, availability, measurements, and installation details.
      </p>
    `;

    await transporter.sendMail({
      from: `"Nilta Flooring Store" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
      to: process.env.CONTACT_TO,
      subject: `New quote request from Store - ${escapeHtml(customerName)}`,
      replyTo: customerEmail || undefined,
      html: adminHtml,
    });

    if (customerEmail) {
      const listHtml = items
        .map((it) => {
          const line = it.lineTotal !== null ? ` — $${it.lineTotal.toFixed(2)}` : "";
          return `<li>${it.quantity} × <b>${escapeHtml(it.name)}</b>${line}</li>`;
        })
        .join("");

      const confirmHtml = `
        <h2>Quote Request Received – Nilta Flooring</h2>
        <p>Dear ${escapeHtml(customerName)},</p>
        <p>Thank you for your interest in our flooring products. We have received your quote request with the following items:</p>
        <ul>${listHtml}</ul>
        <p><b>Estimated total:</b> $${Number(total).toFixed(2)}</p>
        <p>We will review your request and contact you with pricing and availability.</p>
        <p>Kind regards,<br/>Nilta Flooring</p>
      `;

      await transporter.sendMail({
        from: `"Nilta Flooring" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
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

// Public products endpoint
app.get("/api/products", async (req, res) => {
  try {
    const products = await Product.find({ isActive: true }).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error("Error in GET /api/products:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Public gallery endpoint (used by Residential / Commercial pages)
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
