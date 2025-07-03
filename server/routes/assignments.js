const express = require('express');
const Assignment = require('../models/Assignment');
const router = express.Router();

// GET /api/assignments
// GET /api/assignments?engineerId=...
router.get('/', async (req, res) => {
  const { engineerId } = req.query;
  let filter = {};
  if (engineerId) {
    filter.engineerId = engineerId;
  }
  // Populate project and engineer details for richer frontend display
  const assignments = await Assignment.find(filter)
    .populate({
      path: 'projectId',
      select: 'name description managerId',
      populate: { path: 'managerId', select: 'name email' }
    })
    .populate('engineerId', 'name email');
  res.json(assignments);
});


// POST /api/assignments
router.post('/', async (req, res) => {
  try {
    const { engineerId, projectId, allocationPercentage, startDate, endDate, role } = req.body;
    if (!engineerId || !projectId || !allocationPercentage || !startDate || !endDate || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const assignment = new Assignment({
      engineerId,
      projectId,
      allocationPercentage,
      startDate,
      endDate,
      role
    });
    await assignment.save();
    res.status(201).json(assignment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/assignments/:id
router.put('/:id', async (req, res) => {
  try {
    const assignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
    res.json(assignment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/assignments/:id
router.delete('/:id', async (req, res) => {
  const assignment = await Assignment.findByIdAndDelete(req.params.id);
  if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
  res.json({ message: 'Assignment deleted' });
});

module.exports = router;
