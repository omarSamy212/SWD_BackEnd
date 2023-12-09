const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  imageUrl: String,
  files: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
    },
  ],
  phase: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Phase",
    required: true,
  },
});

const Document = mongoose.model("Document", DocumentSchema);

module.exports = { Document, DocumentSchema };
