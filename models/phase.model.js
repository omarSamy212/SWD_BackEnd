const mongoose = require("mongoose");

const PhaseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const Phase = mongoose.model("Phase", PhaseSchema);

module.exports = Phase;
