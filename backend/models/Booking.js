const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  customerContact: { type: String, required: true },
  court: { type: mongoose.Schema.Types.ObjectId, ref: "Court", required: true },
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true },
});

module.exports = mongoose.model("Booking", bookingSchema);
