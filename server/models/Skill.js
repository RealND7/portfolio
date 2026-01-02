const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  language: { type: String, default: 'javascript' }, // 'javascript', 'typescript', 'css', etc.
  code: String, // The code snippet
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Skill', SkillSchema);