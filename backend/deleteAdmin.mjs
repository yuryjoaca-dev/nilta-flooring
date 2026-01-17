import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/nilta-fixed";

const adminUserSchema = new mongoose.Schema({
  email: String,
  passwordHash: String,
});

const AdminUser = mongoose.model("AdminUser", adminUserSchema);

const emailToDelete = process.argv[2];

if (!emailToDelete) {
  console.log("Usage: node deleteAdmin.mjs email@example.com");
  process.exit(0);
}

async function main() {
  await mongoose.connect(MONGO_URI);
  const result = await AdminUser.deleteOne({ email: emailToDelete });

  if (result.deletedCount === 0) {
    console.log("No admin found with that email.");
  } else {
    console.log("Admin deleted:", emailToDelete);
  }

  await mongoose.disconnect();
}

main().catch(console.error);
