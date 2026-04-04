const mongoose = require("mongoose");

const petSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true, index: true },
    name: { type: String, required: true, index: true },
    type: { type: String },
    rarity: { type: String, default: "Common" },
    movementType: { type: String },
    habitat: { type: String },
    maxHealth: { type: Number },
    damage: { type: Number },
    rating: { type: Number },
    power: { type: String },
    behaviour: { type: String },
    aggressive: { type: Boolean, default: false },
    source: { type: String },
    imageId: { type: String },
    imageUrl: { type: String },
    hoverImageUrl: { type: String },
  },
  { timestamps: true }
);

// Case-insensitive name search
petSchema.index({ name: "text" });

module.exports = mongoose.model("Pet", petSchema);
