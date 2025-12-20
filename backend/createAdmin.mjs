// backend/createAdmin.mjs
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { fileURLToPath } from "url";
import path from "path";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/nilta-fixed";

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

const AdminUser = mongoose.model("AdminUser", adminUserSchema);

async function main() {
  await mongoose.connect(MONGO_URI);
  console.log("Mongo connected");

  const email = process.argv[2] || "admin@nilta.com";
  const password = process.argv[3] || "Parola123!";

  let admin = await AdminUser.findOne({ email });
  if (admin) {
    console.log("Admin already exists:", email);
    await mongoose.disconnect();
    return;
  }

  const saltRounds = 12;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  admin = await AdminUser.create({ email, passwordHash });

  console.log("Admin created:");
  console.log("  email:", email);
  console.log("  password:", password);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
