// routes/sports.js
const express = require("express");
const router = express.Router();
const Sport = require("../models/Sport");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
// Create a new sport (admin only)
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  const { name } = req.body;

  try {
    const newSport = new Sport({ name });
    await newSport.save();
    res.status(201).json(newSport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all sports
router.get("/", authMiddleware, async (req, res) => {
  try {
    const sports = await Sport.find();
    res.status(200).json(sports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a sport (admin only)
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  const { name } = req.body;

  try {
    const updatedSport = await Sport.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );
    res.status(200).json(updatedSport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a sport (admin only)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    await Sport.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
