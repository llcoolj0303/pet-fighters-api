const express = require("express");
const router = express.Router();
const Item = require("../models/Item");

// GET /api/items — list items with optional filters
// Query params: type, rarity, tag, limit, skip
router.get("/", async (req, res) => {
  try {
    const { type, rarity, tag, limit = 50, skip = 0 } = req.query;
    const filter = {};
    if (type)   filter.type   = { $regex: new RegExp(`^${type}$`, "i") };
    if (rarity) filter.rarity = { $regex: new RegExp(`^${rarity}$`, "i") };
    if (tag)    filter.tags   = { $regex: new RegExp(`^${tag}$`, "i") };

    const [items, total] = await Promise.all([
      Item.find(filter)
        .sort({ display: 1 })
        .limit(Number(limit))
        .skip(Number(skip))
        .lean(),
      Item.countDocuments(filter),
    ]);
    res.json({ total, limit: Number(limit), skip: Number(skip), data: items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/items/search?q= — fuzzy display name search
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: "Query param 'q' is required" });
    const items = await Item.find({ display: { $regex: new RegExp(q, "i") } })
      .sort({ display: 1 })
      .limit(20)
      .lean();
    res.json({ total: items.length, data: items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/items/eggs — list only egg items with their drop tables
router.get("/eggs", async (req, res) => {
  try {
    const eggs = await Item.find({ tags: "Egg" }).sort({ display: 1 }).lean();
    res.json({ total: eggs.length, data: eggs });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/items/:itemId — get item by string ID
router.get("/:itemId", async (req, res) => {
  try {
    const item = await Item.findOne({ itemId: req.params.itemId }).lean();
    if (!item) return res.status(404).json({ error: `Item '${req.params.itemId}' not found` });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
