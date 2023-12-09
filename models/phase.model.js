const mongoose = require("mongoose");

const PhaseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  documents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
    },
  ],
});

const Phase = mongoose.model("Phase", PhaseSchema);

module.exports = { Phase, PhaseSchema };
