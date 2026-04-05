const mongoose = require("mongoose");

const powerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
  },
  { timestamps: true }
);

powerSchema.index({ name: "text" });

module.exports = mongoose.model("Power", powerSchema);
