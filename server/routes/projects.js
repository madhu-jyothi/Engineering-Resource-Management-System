const express = require('express');
const Project = require('../models/Project');
const router = express.Router();

// GET /api/projects
router.get('/', async (req, res) => {
  const projects = await Project.find();
  res.json(projects);
});

// POST /api/projects
router.post('/', async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GET /api/projects/:id
router.get('/:id', async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ message: 'Project not found' });
  res.json(project);
});

module.exports = router;
