const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
  document: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Document",
  },
  filename: String,
  mimetype: String,
  encoding: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const File = mongoose.model("File", FileSchema);

module.exports = File;
