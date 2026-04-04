const express = require("express");
const router = express.Router();
const Pet = require("../models/Pet");

// GET /api/pets — list all pets (with optional filters)
// Query params: rarity, type, source, limit, skip
router.get("/", async (req, res) => {
  try {
    const { rarity, type, source, limit = 50, skip = 0 } = req.query;
    const filter = {};
    if (rarity) filter.rarity = { $regex: new RegExp(`^${rarity}$`, "i") };
    if (type)   filter.type   = { $regex: new RegExp(`^${type}$`, "i") };
    if (source) filter.source = { $regex: new RegExp(`^${source}$`, "i") };

    const [pets, total] = await Promise.all([
      Pet.find(filter)
        .sort({ id: 1 })
        .limit(Number(limit))
        .skip(Number(skip))
        .lean(),
      Pet.countDocuments(filter),
    ]);

    res.json({ total, limit: Number(limit), skip: Number(skip), data: pets });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/pets/search?q=kitty — fuzzy name search
router.get("/search", async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: "Query param 'q' is required" });

    const pets = await Pet.find({
      name: { $regex: new RegExp(q, "i") },
    })
      .sort({ id: 1 })
      .limit(20)
      .lean();

    res.json({ total: pets.length, data: pets });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/pets/:id — get pet by numeric ID
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "ID must be a number" });

    const pet = await Pet.findOne({ id }).lean();
    if (!pet) return res.status(404).json({ error: `Pet with id ${id} not found` });

    res.json(pet);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
