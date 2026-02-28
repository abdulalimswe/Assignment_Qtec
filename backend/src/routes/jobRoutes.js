const express = require('express');
const router = express.Router();
const { getJobs, getJobById, createJob, deleteJob } = require('../controllers/jobController');
const { validateJob } = require('../middleware/validate');

// Public routes
router.get('/', getJobs);
router.get('/:id', getJobById);

// Admin routes
router.post('/', validateJob, createJob);
router.delete('/:id', deleteJob);

module.exports = router;
