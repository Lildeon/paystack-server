import { Router } from "express";
const router = Router();
import form from "../models/forms.js";

router.post("/webhook", async (req, res) => {
  const event = req.body;

  if (event.event === "charge.success") {
    const reference = event.data.reference;
    const regId = event.data.metadata.registrationId;

    await form.findByIdAndUpdate(regId, {
      paid: true,
      reference,
    });

    console.log("Payment verified:", reference);
  }

  res.sendStatus(200);
});

router.get("/verify/:reference", async (req, res) => {
  const { reference } = req.params;

  const response = await axios.get(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
      },
    },
  );

  res.json(response.data);
});

export default router;
