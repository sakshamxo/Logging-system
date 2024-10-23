const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  actionType: String,
  timestamp: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  role: String,
  additionalData: Object,
  isDeleted: { type: Boolean, default: false },
});

module.exports = mongoose.models.Log || mongoose.model('Log', logSchema);
