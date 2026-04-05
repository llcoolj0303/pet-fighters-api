const mongoose = require("mongoose");

const eggDropSchema = new mongoose.Schema(
  {
    petId: { type: Number, required: true },
    petName: { type: String },
    weight: { type: Number, required: true },
  },
  { _id: false }
);

const itemSchema = new mongoose.Schema(
  {
    itemId: { type: String, required: true, unique: true, index: true },
    display: { type: String, required: true, index: true },
    type: { type: String },
    rarity: { type: String },
    description: { type: String },
    habitat: { type: String },
    maxStackSize: { type: Number },
    subcategory: { type: Number },
    subcategoryOrder: { type: Number },
    levelRequirement: { type: Number },
    sellValue: { type: Number },
    robux: { type: Boolean, default: false },
    duration: { type: Number },
    tags: [{ type: String }],
    stats: { type: mongoose.Schema.Types.Mixed },
    powerBoost: { type: mongoose.Schema.Types.Mixed },
    eggDrops: [eggDropSchema],
    imageUrl: { type: String },
  },
  { timestamps: true }
);

itemSchema.index({ display: "text" });

module.exports = mongoose.model("Item", itemSchema);
