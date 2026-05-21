import { Router } from "express";
const paymentRoutes = Router();
import axios from "axios";
import form from "../models/forms.js";

paymentRoutes.post("/pay", async (req, res) => {
  const {
    event,
    first_name,
    last_name,
    phone,
    code,
    email,
    provider,
    branch,
    amount,
  } = req.body;

  const fullname =
    first_name.replace(/\s/g, "") + " " + last_name.replace(/\s/g, "");

  const userExist = await form.findOne({ event, fullname });
  // User registered but not paid
  try {
    if (userExist && amount > 0) {
      const response = await axios.post(
        "https://api.paystack.co/transaction/initialize",
        {
          email,
          amount: amount * 100,
          metadata: {
            registrationId: userExist._id,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
          },
        },
      );

      return res.json({
        paymentUrl: response.data.data.authorization_url,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Error initializing payment" });
  }
  // Registering paid event first time
  try {
    if (!userExist && amount > 0) {
      // 1. Create registration (unpaid)
      const reg = await form.create({
        event,
        fullname,
        email,
        phone,
        branch,
        paid: false,
      });

      // 2. Initialize Paystack payment
      const response = await axios.post(
        "https://api.paystack.co/transaction/initialize",
        {
          email,
          amount: amount * 100,
          metadata: {
            registrationId: reg._id,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
          },
        },
      );

      return res.json({
        paymentUrl: response.data.data.authorization_url,
      });
    }
  } catch (err) {
    // console.log(err);
    res.status(500).json({ message: "Error initializing payment" });
  }
  if (!userExist) {
    await form.create({
      event,
      fullname,
      email,
      phone,
      branch,
      paid: false,
    });
    return res.status(201).json({ message: "Registration successful" });
  }
  res.json({ message: "Registered already" });
});

export default paymentRoutes;
