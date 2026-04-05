require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const petsRouter = require("./routes/pets");
const powersRouter = require("./routes/powers");
const itemsRouter = require("./routes/items");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ status: "ok", service: "Pet Fighters API", version: "1.0.0" });
});

app.use("/api/pets", petsRouter);
app.use("/api/powers", powersRouter);
app.use("/api/items", itemsRouter);

// 404
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`API running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
