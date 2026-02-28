const Application = require('../models/Application');
const Job = require('../models/Job');

/**
 * @desc  Submit a job application
 * @route POST /api/applications
 * @access Public
 */
const submitApplication = async (req, res, next) => {
  try {
    const { jobId, name, email, resumeLink, coverNote } = req.body;

    // Confirm the referenced job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const application = await Application.create({
      jobId,
      name,
      email,
      resumeLink,
      coverNote,
    });

    res.status(201).json({ success: true, data: application });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc  Get all applications for a specific job
 * @route GET /api/applications/:jobId
 * @access Admin
 */
const getApplicationsByJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    const applications = await Application.findByJobId(jobId);

    res.status(200).json({ success: true, total: applications.length, data: applications });
  } catch (error) {
    next(error);
  }
};

module.exports = { submitApplication, getApplicationsByJob };
