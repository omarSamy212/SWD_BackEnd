const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  fileName: {
    type: String,
    required: true,
  },
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SDLCDocument',
    required: true,
  },
  phaseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Phase',
    required: true,
  },
  fileData: {
    type: Buffer,
    required: true,
  },
});

const File = mongoose.model('File', fileSchema);

module.exports = {File};
