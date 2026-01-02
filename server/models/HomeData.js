const mongoose = require('mongoose');

const HomeDataSchema = new mongoose.Schema({
  heroTitle: String,
  heroSubtitle: String,
  
  // Profile Section
  profileImage: String, // Base64 or URL
  nameKr: String,
  nameEn: String,
  email: String,
  phone: String,

  // About Me Section
  aboutMeTitle: String,
  aboutMeContent: String,

  // Career Section
  careerTitle: String,
  careerContent: String,

  // Project Section (Summary)
  projectTitle: String,
  projectContent: String,

  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('HomeData', HomeDataSchema);