import { Schema, model } from "mongoose";

const eventShema = new Schema(
  {
    name: String,
    location: String,
    date: Date,
  },
  { timestamps: true },
);

export const event = model("Event", eventShema);
