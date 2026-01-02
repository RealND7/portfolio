const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: String,
  client: String,
  service: String,
  year: String,
  location: String,
  description: String,
  image: String, // URL or color class
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Project', ProjectSchema);