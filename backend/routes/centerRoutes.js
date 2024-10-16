const express = require("express");
const Center = require("../models/Center");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware"); // Import admin middleware

const router = express.Router();

// Get all centers (public)
router.get("/", async (req, res) => {
  try {
    const centers = await Center.find().populate("sports");
    res.status(200).json(centers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new center (admin only)
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  const { name, location } = req.body;

  try {
    const newCenter = new Center({ name, location });
    await newCenter.save();
    res.status(201).json(newCenter);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a center (admin only)
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  const { name, location } = req.body;

  try {
    const updatedCenter = await Center.findByIdAndUpdate(
      req.params.id,
      { name, location },
      { new: true }
    );
    if (!updatedCenter)
      return res.status(404).json({ message: "Center not found" });
    res.status(200).json(updatedCenter);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a center (admin only)
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const deletedCenter = await Center.findByIdAndDelete(req.params.id);
    if (!deletedCenter)
      return res.status(404).json({ message: "Center not found" });
    res.status(200).json({ message: "Center deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
