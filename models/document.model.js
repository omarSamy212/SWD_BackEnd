const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
  phase: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Phase",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  files: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
    },
  ],
});

const Document = mongoose.model("Document", DocumentSchema);

module.exports = Document;
