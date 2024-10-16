const mongoose = require("mongoose");

const courtSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sport: { type: mongoose.Schema.Types.ObjectId, ref: "Sport", required: true },
});

module.exports = mongoose.model("Court", courtSchema);
