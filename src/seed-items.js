/**
 * Seed MongoDB with all item data + jsDelivr CDN image URLs.
 * Usage: MONGODB_URI=... node src/seed-items.js
 */
require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Item = require("./models/Item");

const CDN = "https://cdn.jsdelivr.net/gh/llcoolj0303/pet-fighters-assets@main/cropped";

function itemImageUrl(itemId) {
  return `${CDN}/item_${itemId}.png`;
}

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");

  // Read items data from JSON (extracted from game via Luau)
  const rawPath = path.join(__dirname, "items_data.json");
  const items = JSON.parse(fs.readFileSync(rawPath, "utf-8"));

  const docs = items
    .filter((i) => i.itemId !== "WeaponStats") // skip non-item entry
    .map((i) => ({
      itemId: i.itemId,
      display: i.display || i.itemId,
      type: i.type || null,
      rarity: i.rarity || null,
      description: i.description || null,
      habitat: i.habitat || null,
      maxStackSize: i.maxStackSize ?? null,
      subcategory: i.subcategory ?? null,
      subcategoryOrder: i.subcategoryOrder ?? null,
      levelRequirement: i.levelRequirement ?? null,
      sellValue: i.sellValue ?? null,
      robux: i.robux || false,
      duration: i.duration ?? null,
      tags: i.tags || [],
      stats: i.stats || null,
      powerBoost: i.powerBoost || null,
      eggDrops: i.eggDrops || [],
      imageUrl: i.imageAssetId ? itemImageUrl(i.itemId) : null,
    }));

  await Item.deleteMany({});
  console.log("Cleared existing items");

  await Item.insertMany(docs);
  console.log(`Seeded ${docs.length} items`);

  await mongoose.disconnect();
  console.log("Done!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
