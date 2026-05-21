// routes/auth.js
import { Router } from "express";
import { hash, compare } from "bcryptjs";
import { sign } from "jsonwebtoken";
import user from "../models/user";
import admin from "../middleware/admin.js";
const authRoutes = Router();
// REGISTER
authRoutes.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  const hashedPassword = await hash(password, 10);

  const user = await user.create({
    name,
    email,
    password: hashedPassword,
  });

  res.json({ message: "User created" });
});

// LOGIN
authRoutes.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await findOne({ email });

  if (!user) return res.status(400).send("User not found");

  const valid = await compare(password, user.password);

  if (!valid) return res.status(400).send("Invalid password");

  const token = sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  res.json({ token, user });
});

authRoutes.post("/forms", auth, admin, async (req, res) => {
  const form = await Form.create(req.body);
  res.json(form);
});

export default authRoutes;
