const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  const { customerName, customerContact, court, date, timeSlot } = req.body;

  try {
    const newBooking = new Booking({
      customerName,
      customerContact,
      court,
      date,
      timeSlot,
      user: req.user.id,
    });
    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate(
      "court"
    );
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/admin", authMiddleware, adminMiddleware, async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Access denied" });
  }
  try {
    const bookings = await Booking.find().populate("court user");
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
