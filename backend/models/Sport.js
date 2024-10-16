const mongoose = require("mongoose");

const sportSchema = new mongoose.Schema({
  name: { type: String, required: true },
  center: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Center",
    required: true,
  },
  courts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Court" }],
});
const Sport = mongoose.model("Sport", sportSchema);
module.exports = Sport;
