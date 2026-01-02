const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');

// POST new message
router.post('/', async (req, res) => {
  try {
    const newMessage = new Contact(req.body);
    const savedMessage = await newMessage.save();
    res.json(savedMessage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET all messages (for admin)
router.get('/', async (req, res) => {
  try {
    const messages = await Contact.find().sort({ date: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
