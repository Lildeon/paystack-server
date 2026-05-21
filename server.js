import "dotenv/config";
import express, { json } from "express";
import { connect } from "mongoose";
import paymentRoutes from "./server/routes/payment.js";
import router from "./server/routes/webhook.js";
import formRoutes from "./server/routes/forms.js";
// import authRoutes from "./routes/auth.js";
// import admin from "./routes/admin.js";
import cors from "cors";
import eventRoutes from "./server/routes/event.js";

const app = express();

const prod = {
  local: "http://localhost:5173",
  dev: "https://event-tlpci-youthfellowship.netlify.app",
};
app.use(json());
app.use(
  cors({
    origin: prod.dev,
  }),
);
app.use(express.urlencoded({ extended: true }));

connect(`${process.env.MONGO_URI}`).then(() => console.log("DB connected"));

app.listen(5000, () => console.log("Server running"));

app.use("/api", paymentRoutes);
app.use("/api", router);
app.use("/api", eventRoutes);
app.use("/api", formRoutes);
// app.use("/api/auth", authRoutes);
// app.use("/api/admin", admin);
