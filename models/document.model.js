const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  phaseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Phase',
    required: true,
  },
  fileIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UploadedFile',
  }],
});

const Document = mongoose.model('Document', documentSchema);

module.exports = {Document};
