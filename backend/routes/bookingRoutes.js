const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Court = require("../models/Court");
const authMiddleware = require("../middlewares/authMiddleware");
const adminMiddleware = require("../middlewares/adminMiddleware");

router.post("/", authMiddleware, async (req, res) => {
  const { customerName, customerContact, court, date, timeSlot, user } =
    req.body;

  try {
    const existingCourt = await Court.findById(court);
    if (!existingCourt) {
      return res.status(404).json({ message: "Court not found" });
    }

    // console.log("Request Body:", req.body);

    const [startSlotTime, endSlotTime] = timeSlot
      .split(" - ")
      .map((time) => time.trim());
    // console.log(startSlotTime);
    // console.log(endSlotTime);
    // console.log(date);
    const startSlot = new Date(`${date}T${startSlotTime.replace(" ", ":")}:00`); // Adding seconds
    const endSlot = new Date(startSlot.getTime() + 60 * 60 * 1000); // Add 60 minutes

    // console.log("Parsed Start Slot: ", startSlot);
    // console.log("Parsed End Slot: ", endSlot);

    if (isNaN(startSlot.getTime()) || isNaN(endSlot.getTime())) {
      return res.status(400).json({ message: "Invalid date or time format" });
    }

    const existingBooking = await Booking.findOne({
      court,
      date,
      $or: [{ startTime: { $lt: endSlot }, endTime: { $gt: startSlot } }],
    });

    if (existingBooking) {
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
      startTime: startSlot,
      endTime: endSlot,
      user,
    });

    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
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

router.get("/admin", authMiddleware, adminMiddleware, async (req, res) => {
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

router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
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

router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
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
