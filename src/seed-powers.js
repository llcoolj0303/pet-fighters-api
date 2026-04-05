/**
 * Seed MongoDB with all power data.
 * Usage: MONGODB_URI=... node src/seed-powers.js
 */
require("dotenv").config();
const mongoose = require("mongoose");
const Power = require("./models/Power");

const POWERS = [
  { name: "Abyssal Haste", description: "Swim 2x faster." },
  { name: "Arcane Pulse", description: "Shoots an unstable beam of magic. Bonus Effect: Inflicts a random condition on the enemy" },
  { name: "Arctic Armor", description: "All Pets are immune to Knockback effects." },
  { name: "Ballistic Blows", description: "Damages target 3 times in quick succession" },
  { name: "Black Hole", description: "Marquis of Mysteria has a 10% chance to spawn a black hole on attack, leeching 5% health per second for 5s." },
  { name: "Blinding Boost", description: "Solar Pets deal 1.5x damage." },
  { name: "Brittle Freeze", description: "Freeze Bonus Effect on enemies prevents movement and lasts 5s longer" },
  { name: "Bubble Armor", description: "A shield of bubbles surrounds your team, increasing all Health by 25%" },
  { name: "Catch Master", description: "Fish 25% faster." },
  { name: "Cold Shock", description: "Frozen enemies take 2x more damage from Evil attacks." },
  { name: "Compound Eyes", description: "Sniper Rifles deal 1.5x damage." },
  { name: "Crimson Whirlpool", description: "Enemies currently affected by Whirlpool take 2x damage." },
  { name: "Curse", description: "Manifests a haunting curse. Bonus Effect: 20% chance to prevent enemy from healing for 5s" },
  { name: "Cyber Boost", description: "Electric Pets deal 1.5x damage." },
  { name: "DOOMSDAY", description: "When an enemy hits 20% health, they freeze for 2 seconds then instantly faint" },
  { name: "Dark Manastorm", description: "Summon a manastorm every minute in combat for 10s, increasing Evil Pets' damage by 5x." },
  { name: "Deep Sea Boost", description: "Water Pets deal 1.25x damage." },
  { name: "Divine Blessing", description: "Healing items and abilities are 1.5x more effective." },
  { name: "Double Shot", description: "Shoot 2 bullets at once." },
  { name: "Dragon Boost", description: "Monster Pets deal 1.25x damage." },
  { name: "Dragon Rage", description: "Upgrade all Monster Pets' 'Roar' Power, increasing Range by 25%, Fear Chance by 5% and Damage by 10%" },
  { name: "Earthquake", description: "Shatters the ground with a shockwave. Bonus Effect: Stuns the enemy for 2s" },
  { name: "Egg Slasher", description: "Eggs are 25% cheaper in Item Store!" },
  { name: "Fairy Wave", description: "Casts a fantastic wave of light. Bonus Effect: 25% chance to create an invincible forcefield for 2s" },
  { name: "Fairy's Fortune", description: "Pixie Pets grant 2x Gold when defeated." },
  { name: "Fear of the Sea", description: "Enemies affected by fear take 50% more damage from water attacks." },
  { name: "Feathered Falling", description: "Decrease the speed of gravity by 50%" },
  { name: "Fire & Venom", description: "Fire pets' Burn bonus effect also poison the enemy, dealing double Burn damage." },
  { name: "Fireball", description: "Launches a scorching ball of fire. Bonus Effect: Burns the enemy for 5s" },
  { name: "Floral Blast", description: "Discharges glowing photosynthetic energy. Bonus Effect: 25% chance to grant your team a healing aura." },
  { name: "Flutterstep", description: "Your Pets' Class Powers have a 35% chance to hit instantly with an Easter explosion." },
  { name: "Freeze Ray", description: "Projects a powerful beam of ice. Bonus Effect: Freezes the enemy for 5s" },
  { name: "Friendly Boost", description: "Ice Pets deal 1.25x damage." },
  { name: "Frostify", description: "All attacks become Ice class." },
  { name: "Frozen Armor", description: "Your team takes 1.5x less damage overall but 3x more damage from Fire class" },
  { name: "Full Metal Boost", description: "Boost metal pet's damage by 50%." },
  { name: "Full Metal Shells", description: "Shotguns deal 1.5x damage." },
  { name: "Fuzzy Friend", description: "Gain 1.1x more gold when a friend is in the server." },
  { name: "Gale Rush", description: "Slices the enemy with a sharp blade of wind. Bonus Effect: 20% chance to double your team's attack speed for 5s" },
  { name: "Gilded Age", description: "Wild Pets drop 2x loot" },
  { name: "Hasty Hooves", description: "Reduce all Power cooldowns by 15%" },
  { name: "Headbutt", description: "Charges into the enemy head-first." },
  { name: "Heavy Metal", description: "Player's pets move 2x slower but deal 2x damage." },
  { name: "Hex Boost", description: "Magic Pets deal 1.25x damage." },
  { name: "Hologram", description: "Summons a Hologram that deals 50% of Holo Raptor's damage." },
  { name: "Horned Renewal", description: "Regenerates 2.5% health for the player and all equipped pets every second." },
  { name: "Hunter's Order", description: "Nearby Rare+ Pets are Marked. Marked Pets take 3x Damage from Weapons." },
  { name: "Hypersentry", description: "Every 2m deploy a Hypersentry for 10s that rapidly shoots nearby enemies dealing 1/5th of Supernova's Damage per hit." },
  { name: "Ice Breaker", description: "Frozen enemies hit by Frostbite are unfrozen, shooting ice shards at nearby enemies that deal 20% Health damage." },
  { name: "Ice Master", description: "You and your Pets deal 1.5x Damage in Frozen Wastes." },
  { name: "Ironclad Negotiation", description: "Defeating a Metal pet drops 2x Metal Scraps but no Gold or XP." },
  { name: "Kapow!", description: "All bullets explode on impact and deal AOE damage!" },
  { name: "Katana Expert", description: "Katanas attack 2x faster" },
  { name: "Lightning Strike", description: "Summons lightning from the sky. Bonus Effect: 25% chance to electrocute the enemy" },
  { name: "Lights of Greed", description: "25% chance to earn 2x gold from defeating enemies." },
  { name: "Malicious Boost", description: "Evil Pets deal 1.5x damage." },
  { name: "Merlin's Wisdom", description: "Boosts XP by 100%" },
  { name: "Militarization", description: "Guns deal 1.25x damage." },
  { name: "Moon Boots", description: "Reduce the force of gravity by 75%!" },
  { name: "Mythic Power", description: "Egg prices in ship are 25% cheaper!" },
  { name: "OG Boost I", description: "Your Pets and Weapons deal 1.25x Damage." },
  { name: "OG Boost II", description: "Your Pets and Weapons deal 1.5x Damage." },
  { name: "OG Boost III", description: "Your Pets and Weapons deal 1.75x Damage." },
  { name: "Order of the Boss", description: "This Boss Pet cannot be equipped alongside any other Pet" },
  { name: "Phantom", description: "Player and pets are invisible and undetectable unless combat is initiated by player" },
  { name: "Pollution", description: "Metal pets deal critical damage to and resist Plant and Pixie enemies" },
  { name: "Power Surge", description: "Tasergun and Thunder Grenade deal 3x damage." },
  { name: "Pulsebreaker (Quick Attack)", description: "???" },
  { name: "Pulsebreaker (Special Attack)", description: "???" },
  { name: "Quantum Chamber", description: "All Weapons reload instantly." },
  { name: "Quartz Trap", description: "Lays a Quartz Trap near the player every 10s. Any enemy that steps in it loses 25% health and is immobilized for 3s" },
  { name: "Radiant Light", description: "Emits a piercing ray of light. Bonus Effect: Blinds the enemy for 5s" },
  { name: "Rich Soil", description: "When your Earth Pets deal damage, flowers bloom and heal a random party member for 5% Max Health" },
  { name: "Roar", description: "Vocalizes a loud, horrifying sound. Bonus Effect: Inflicts fear upon the enemy for 2s" },
  { name: "Rock Boost", description: "Earth Pets deal 1.5x damage." },
  { name: "Royal Spoils", description: "1.25x increased chances for rare loot (non-pet class loot)." },
  { name: "Sea Master", description: "1.5x more damage for water pets." },
  { name: "Secret Power", description: "Pet attacks have 50% chance to hit instantly bypassing hit animation duration." },
  { name: "Shapeshift", description: "Seraph transforms into the first enemy Pet damaged until the end of combat." },
  { name: "Sharpen", description: "Sharpens Melee Weapons, making them deal 1.5x more damage." },
  { name: "Showstopper", description: "Player's team is immune to Bonus Effects" },
  { name: "Sky Shredder", description: "Summon a moving tornado every 2 minutes for 10s, dealing 200% damage to all enemies inside every second." },
  { name: "Sky Splitter", description: "Summon a thunderstorm every minute for 10s, striking up to 8 nearby enemies for 10x damage." },
  { name: "Snowstorm", description: "Summon a snowstorm around your Character, slowing nearby enemies and dealing 1/6th damage per second." },
  { name: "Spiral Boost", description: "Wind Pets deal 1.2x damage." },
  { name: "Steel Shards", description: "Unleashes a storm of razor-sharp metal shards. Bonus Effect: Hits 3 enemies at once" },
  { name: "Sun Slash", description: "Call upon the power of the Sun to slash target for huge damage." },
  { name: "Sweet Boost", description: "Pixie Pets deal 1.25x damage." },
  { name: "Sweetest Boost", description: "Pixie Pets deal 1.5x damage." },
  { name: "Techno Master", description: "Player and pets deal 1.5x damage to Ultra Corp mobs." },
  { name: "The Many", description: "The Hivemind doubles in damage for each Space Egg Pet equipped but prevents you from using weapons." },
  { name: "The One", description: "If only Plasmax is equipped, gain 2x walkspeed, 2x jump power, 1.5x weapon damage, 1.5x health, and 1.5x healing" },
  { name: "Thorny Boost", description: "Plant Pets deal 1.25x damage." },
  { name: "Tornado", description: "Summons a tornado around player every 2 minutes for 10s, striking all pets within by 2x damage per second." },
  { name: "Undying Flames", description: "Upon dying, sacrifice Phoenix and revive with full HP, becoming immune to all damage for 3 seconds." },
  { name: "Vine Burst", description: "Shooting an enemy has a 25% chance to encase them in vines, slowing them by 25% until defeated." },
  { name: "Whirlpool", description: "Unleashes a violent vortex of water. Bonus Effect: Deals damage to all enemies in the whirlpool and traps them" },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB");

  await Power.deleteMany({});
  console.log("Cleared existing powers");

  await Power.insertMany(POWERS);
  console.log(`Seeded ${POWERS.length} powers`);

  await mongoose.disconnect();
  console.log("Done!");
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
