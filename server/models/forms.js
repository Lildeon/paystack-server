import { Schema, model } from "mongoose";

const formSchema = new Schema(
  {
    event: String,
    fullname: String,
    email: String,
    phone: Number,
    branch: String,
    amount: Number,
    paid: { type: Boolean, default: false },
    reference: String,
  },
  { timestamps: true },
);
const form = model("Form", formSchema);
export default form;
