const express = require('express');
const router = express.Router();
const VisitorLog = require('../models/VisitorLog');
const jwt = require('jsonwebtoken');

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Access Denied' });

  try {
    const verified = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: 'Invalid Token' });
  }
};

// Admin Login
router.post('/login', (req, res) => {
  const { password } = req.body;
  if (password === process.env.ADMIN_PASSWORD) {
    const token = jwt.sign({ role: 'admin' }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(400).json({ message: 'Invalid Password' });
  }
});

// GET visitor stats (Protected)
router.get('/stats', verifyToken, async (req, res) => {
  try {
    const totalVisitors = await VisitorLog.countDocuments({ action: 'Visit' });
    const pageViews = await VisitorLog.countDocuments();
    
    // Simple aggregation for daily visitors (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const dailyStats = await VisitorLog.aggregate([
      { $match: { timestamp: { $gte: sevenDaysAgo }, action: 'Visit' } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    // Aggregation for popular pages
    const popularPages = await VisitorLog.aggregate([
      { $match: { action: 'PageView' } },
      { $group: { _id: "$page", views: { $sum: 1 } } },
      { $sort: { views: -1 } },
      { $limit: 5 },
      { $project: { name: "$_id", views: 1, _id: 0 } }
    ]);

    const logs = await VisitorLog.find().sort({ timestamp: -1 }).limit(20);

    res.json({
      totalVisitors,
      pageViews,
      dailyStats,
      popularPages,
      logs
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST log entry
router.post('/log', async (req, res) => {
  const log = new VisitorLog({
    ip: req.ip,
    userAgent: req.headers['user-agent'],
    ...req.body
  });
  try {
    await log.save();
    res.status(201).json(log);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;