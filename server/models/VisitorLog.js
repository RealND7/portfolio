const mongoose = require('mongoose');

const VisitorLogSchema = new mongoose.Schema({
  ip: String,
  page: String,
  action: String, // 'Visit', 'Click', etc.
  userAgent: String,
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('VisitorLog', VisitorLogSchema);