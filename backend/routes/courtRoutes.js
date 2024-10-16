// routes/courts.js
const express = require("express");
const router = express.Router();
const Court = require("../models/Court");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

// Add a new court (admin only)
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  const { name, sport, center } = req.body;
  try {
    const newCourt = new Court({ name, sport, center });
    await newCourt.save();
    res.status(201).json(newCourt);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all courts
router.get("/", authMiddleware, async (req, res) => {
  try {
    const courts = await Court.find().populate("sport center");
    res.status(200).json(courts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a court (admin only)
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  const { name, sport, center } = req.body;
  try {
    const updatedCourt = await Court.findByIdAndUpdate(
      req.params.id,
      { name, sport, center },
      { new: true }
    );
    res.status(200).json(updatedCourt);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a court (admin only)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await Court.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
