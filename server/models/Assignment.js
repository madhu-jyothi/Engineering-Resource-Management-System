// Assignment model
const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
  engineerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  allocationPercentage: { type: Number, min: 0, max: 100 },
  startDate: Date,
  endDate: Date,
  role: String
});

module.exports = mongoose.model('Assignment', assignmentSchema);
