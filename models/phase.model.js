const mongoose = require('mongoose');

const phaseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const Phase = mongoose.model('Phase', phaseSchema);

module.exports = {Phase};
