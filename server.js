const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // enables reading from .env

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const MONGO_URI = process.env.MONGODB_URI;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const CounterSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  count: { type: Number, default: 0 },
});

const Counter = mongoose.model("Counter", CounterSchema);

// GET: fetch counter
app.get("/count", async (req, res) => {
  try {
    let counter = await Counter.findOne({ name: "downloads" });
    if (!counter) {
      counter = await Counter.create({ name: "downloads", count: 0 });
    }
    res.json({ value: counter.count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: increment counter
app.post("/count", async (req, res) => {
  try {
    const counter = await Counter.findOneAndUpdate(
      { name: "downloads" },
      { $inc: { count: 1 } },
      { new: true, upsert: true }
    );
    res.json({ value: counter.count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
