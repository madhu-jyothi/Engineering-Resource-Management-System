const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Project = require('./models/Project');
const Assignment = require('./models/Assignment');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  await User.deleteMany({});
  await Project.deleteMany({});
  await Assignment.deleteMany({});

  // Engineers
  const password = await bcrypt.hash('password123', 10);
  const engineers = await User.insertMany([
    {
      email: 'alice@company.com', name: 'Alice', password, role: 'engineer', skills: ['React', 'Node.js'], seniority: 'senior', maxCapacity: 100, department: 'Frontend'
    },
    {
      email: 'bob@company.com', name: 'Bob', password, role: 'engineer', skills: ['Python', 'Node.js'], seniority: 'mid', maxCapacity: 50, department: 'Backend'
    },
    {
      email: 'carol@company.com', name: 'Carol', password, role: 'engineer', skills: ['React', 'Python'], seniority: 'junior', maxCapacity: 100, department: 'Fullstack'
    },
    {
      email: 'dave@company.com', name: 'Dave', password, role: 'engineer', skills: ['Node.js'], seniority: 'mid', maxCapacity: 50, department: 'Backend'
    }
  ]);

  // Manager
  const manager = await User.create({
    email: 'manager@company.com', name: 'Manager Mike', password, role: 'manager', department: 'Management'
  });

  // Projects
  const projects = await Project.insertMany([
    {
      name: 'Project Alpha', description: 'Frontend React app', startDate: new Date('2025-07-01'), endDate: new Date('2025-09-01'), requiredSkills: ['React'], teamSize: 2, status: 'active', managerId: manager._id
    },
    {
      name: 'Project Beta', description: 'Backend API', startDate: new Date('2025-06-15'), endDate: new Date('2025-10-01'), requiredSkills: ['Node.js', 'Python'], teamSize: 3, status: 'planning', managerId: manager._id
    },
    {
      name: 'Project Gamma', description: 'Fullstack platform', startDate: new Date('2025-05-01'), endDate: new Date('2025-12-01'), requiredSkills: ['React', 'Node.js'], teamSize: 4, status: 'active', managerId: manager._id
    },
    {
      name: 'Project Delta', description: 'Data pipeline', startDate: new Date('2025-08-01'), endDate: new Date('2025-11-01'), requiredSkills: ['Python'], teamSize: 2, status: 'planning', managerId: manager._id
    }
  ]);

  // Assignments
  await Assignment.insertMany([
    // Alice full-time on Alpha
    { engineerId: engineers[0]._id, projectId: projects[0]._id, allocationPercentage: 100, startDate: new Date('2025-07-01'), endDate: new Date('2025-09-01'), role: 'Developer' },
    // Bob part-time on Beta
    { engineerId: engineers[1]._id, projectId: projects[1]._id, allocationPercentage: 50, startDate: new Date('2025-06-15'), endDate: new Date('2025-10-01'), role: 'Developer' },
    // Carol full-time on Gamma
    { engineerId: engineers[2]._id, projectId: projects[2]._id, allocationPercentage: 100, startDate: new Date('2025-05-01'), endDate: new Date('2025-12-01'), role: 'Tech Lead' },
    // Dave part-time on Delta
    { engineerId: engineers[3]._id, projectId: projects[3]._id, allocationPercentage: 50, startDate: new Date('2025-08-01'), endDate: new Date('2025-11-01'), role: 'Developer' },
    // Alice part-time on Beta
    { engineerId: engineers[0]._id, projectId: projects[1]._id, allocationPercentage: 50, startDate: new Date('2025-06-15'), endDate: new Date('2025-10-01'), role: 'Consultant' },
    // Bob part-time on Gamma
    { engineerId: engineers[1]._id, projectId: projects[2]._id, allocationPercentage: 50, startDate: new Date('2025-05-01'), endDate: new Date('2025-12-01'), role: 'Developer' },
    // Carol part-time on Alpha
    { engineerId: engineers[2]._id, projectId: projects[0]._id, allocationPercentage: 50, startDate: new Date('2025-07-01'), endDate: new Date('2025-09-01'), role: 'Developer' },
    // Dave full-time on Beta
    { engineerId: engineers[3]._id, projectId: projects[1]._id, allocationPercentage: 100, startDate: new Date('2025-06-15'), endDate: new Date('2025-10-01'), role: 'Tech Lead' }
  ]);

  console.log('Database seeded!');
  process.exit();
}

seed();
