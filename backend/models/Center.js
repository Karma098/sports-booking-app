const mongoose = require("mongoose");

const centerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  sports: [{ type: mongoose.Schema.Types.ObjectId, ref: "Sport" }],
});

const Center = mongoose.model("Center", centerSchema);

module.exports = Center;
