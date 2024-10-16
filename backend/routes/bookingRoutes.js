const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Court = require("../models/Court");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

// Create a booking with availability check
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
  const { customerName, customerContact, court, date, timeSlot, user } =
    req.body;

  try {
    const existingCourt = await Court.findById(court);
    if (!existingCourt) {
      return res.status(404).json({ message: "Court not found" });
    }

    const startDateTime = new Date(`${date}T${timeSlot}`);
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);
    const overlappingBooking = await Booking.findOne({
      court,
      date,
      $or: [
        { startTime: { $lt: endDateTime }, endTime: { $gt: startDateTime } },
      ],
    });

    if (overlappingBooking) {
      return res
        .status(400)
        .json({ message: "This time slot is already booked" });
    }

    const newBooking = new Booking({
      customerName,
      customerContact,
      court,
      date,
      timeSlot,
      startTime: startDateTime,
      endTime: endDateTime,
      user,
    });

    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all bookings for the authenticated user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({
      customerContact: req.user.email,
    }).populate("court");
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin view all bookings
router.get("/admin", authMiddleware, async (req, res) => {
  // Check if user is admin
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const bookings = await Booking.find().populate("court");
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a booking (Admin only)
router.put("/:id", authMiddleware, async (req, res) => {
  // Check if user is admin
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a booking (Admin only)
router.delete("/:id", authMiddleware, async (req, res) => {
  // Check if user is admin
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const deletedBooking = await Booking.findByIdAndDelete(req.params.id);
    if (!deletedBooking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.status(204).send(); // No content
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
