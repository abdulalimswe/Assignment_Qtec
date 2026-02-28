const express = require('express');
const router = express.Router();
const { submitApplication, getApplicationsByJob } = require('../controllers/applicationController');
const { validateApplication } = require('../middleware/validate');

// Public route
router.post('/', validateApplication, submitApplication);

// Admin route – view all applications for a job
router.get('/:jobId', getApplicationsByJob);

module.exports = router;
