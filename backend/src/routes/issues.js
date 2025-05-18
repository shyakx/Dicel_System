const express = require('express');
const router = express.Router();
const Issue = require('../models/Issue');
const auth = require('../middleware/auth');

// Get all issues for the logged-in user
router.get('/my', auth, async (req, res) => {
  try {
    const issues = await Issue.find({ assignedTo: req.user._id });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update an issue
router.put('/:id', auth, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }
    
    if (issue.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { status, resolution } = req.body;
    issue.status = status;
    issue.resolution = resolution;
    issue.updatedAt = Date.now();

    const updatedIssue = await issue.save();
    res.json(updatedIssue);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router; 