import { Router } from "express";
const eventRoutes = Router();
import { event } from "../models/event.js";
import form from "../models/forms.js";

// Create form
eventRoutes.post("/create-event", async (req, res) => {
  const eventExists = await event.findOne({ name: req.body.name });
  if (eventExists) {
    return res.json({ message: "Event already exists" });
  }
  await event.create(req.body);

  res.status(201).json({ message: "Event created successfully" });
});
eventRoutes.get("/events", async (req, res) => {
  const form = await event.find({}).sort({ createdAt: -1 });

  res.json(form);
});
eventRoutes.get("/event/:id", async (req, res) => {
  const form = await event.findOne({ name: req.params.id });
  if (!form) {
    return res.status(404).json({ message: "Event not found" });
  }
  res.json(form);
});
eventRoutes.put("/edit-event/:id", async (req, res) => {
  const { name, location, date } = req.body;
  const eventExist = await event.findOne({
    name,
  });
  if (eventExist) {
    return res.json({ message: "Event already exist" });
  }

  await event.updateOne(
    { name: req.params.id },
    { $set: { name, location, date } },
  );
  await form.updateMany({ event: req.params.id }, { $set: { event: name } });
  res.status(201).json({ message: "Update done" });
});
eventRoutes.delete("/delete-event/:id", async (req, res) => {
  await event.findByIdAndDelete({ _id: req.params.id });
  res.json("Delete done");
});
export default eventRoutes;
