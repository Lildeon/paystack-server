// routes/forms.js
import { Router } from "express";
const formRoutes = Router();
import form from "../models/forms.js";

// Create form
formRoutes.post("/forms", async (req, res) => {
  const data = await form.create(req.body);
  res.json(data);
});

// Get form
formRoutes.get("/people/:id", async (req, res) => {
  const totalDocument = await form
    .find({ event: req.params.id })
    .countDocuments();
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 50;
  const filter = req.query.filter;
  const id = req.params.id;
  const skip = (page - 1) * limit;
  const totalPages = Math.ceil(totalDocument / limit);
  const hasMore = page * limit < totalDocument;

  const branches = await form.find({ event: req.params.id }, "branch");
  const unique = [];

  for (const obj of branches) {
    const whitespace = obj.branch.replace(/\s/g, "");
    if (!unique.includes(whitespace.toLowerCase())) {
      unique.push(whitespace.toLowerCase());
    }
  }

  const stats = [];
  for (const branch of unique) {
    const tally = branches.filter(
      (v) => v.branch.replace(/\s/g, "").toLocaleLowerCase() === branch,
    );

    stats.push({
      branch,
      people: tally.length,
      line: tally.length,
      scatter: tally.length,
      area: tally.length,
    });
  }

  if (filter) {
    const filterTotalDocument = await form
      .find({
        event: req.params.id,
        branch: { $regex: filter, $options: "ix" },
      })
      .countDocuments();
    const data = await form
      .find({
        event: req.params.id,
        branch: { $regex: filter, $options: "ix" },
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const filterTotalPages = Math.ceil(filterTotalDocument / limit);
    const filterHasMore = page * limit < filterTotalDocument;

    return res.json({
      data,
      totalPages: filterTotalPages,
      hasMore: filterHasMore,
      unique,
      stats,
      totalDocument,
    });
  }

  const data = await form
    .find({ event: req.params.id })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  res.json({ data, totalPages, hasMore, unique, stats, totalDocument });
});

formRoutes.get("/search", async (req, res) => {
  const term = req.query.query;

  const search = await form.findOne({
    fullname: { $regex: term, $options: "xi" },
  });
  if (!search) {
    return res.json({ text: "Not found" });
  }
  if (term) {
    return res.json(search);
  }
  res.json({ text: "Not found" });
});

export default formRoutes;
