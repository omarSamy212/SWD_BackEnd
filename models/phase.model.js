const mongoose = require("mongoose");
const { Document } = require("./document.model"); // Adjust the path based on your file structure

const PhaseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
  },
  documents: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
    },
  ],
});

const Phase = mongoose.model("phase", PhaseSchema);

module.exports = { Phase, PhaseSchema };
