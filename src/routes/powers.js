const express = require("express");
const router = express.Router();
const Power = require("../models/Power");

// GET /api/powers — list all powers
router.get("/", async (req, res) => {
  try {
    const { limit = 100, skip = 0 } = req.query;
    const [powers, total] = await Promise.all([
      Power.find()
        .sort({ name: 1 })
        .limit(Number(limit))
        .skip(Number(skip))
        .lean(),
      Power.countDocuments(),
    ]);
    res.json({ total, limit: Number(limit), skip: Number(skip), data: powers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/powers/search?q= — fuzzy name search
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: "Query param 'q' is required" });
    const powers = await Power.find({ name: { $regex: new RegExp(q, "i") } })
      .sort({ name: 1 })
      .limit(20)
      .lean();
    res.json({ total: powers.length, data: powers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/powers/:name — get power by exact name
router.get("/:name", async (req, res) => {
  try {
    const power = await Power.findOne({
      name: { $regex: new RegExp(`^${req.params.name}$`, "i") },
    }).lean();
    if (!power) return res.status(404).json({ error: `Power '${req.params.name}' not found` });
    res.json(power);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
