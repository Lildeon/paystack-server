// models/User.js
import { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: "user" }, // "admin" or "user"
  },
  { timestamps: true },
);

export const user = models?.user || model("User", userSchema);
