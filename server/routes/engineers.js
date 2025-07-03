const express = require('express');
const User = require('../models/User');
const router = express.Router();

// GET /api/engineers
router.get('/', async (req, res) => {
  const engineers = await User.find({ role: 'engineer' }).select('-password');
  res.json(engineers);
});

// GET /api/engineers/:id/capacity
router.get('/:id/capacity', async (req, res) => {
  const engineer = await User.findById(req.params.id);
  if (!engineer || engineer.role !== 'engineer') return res.status(404).json({ message: 'Engineer not found' });
  res.json({ maxCapacity: engineer.maxCapacity });
});

module.exports = router;
