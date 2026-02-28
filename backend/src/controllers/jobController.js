const Job = require('../models/Job');

/**
 * @desc  Get all jobs with optional search and filter
 * @route GET /api/jobs
 * @access Public
 */
const getJobs = async (req, res, next) => {
  try {
    const { search, category, location, page = 1, limit = 10 } = req.query;

    const query = {};

    // Full-text search on title, company, and location
    if (search) {
      query.$text = { $search: search };
    }

    if (category) {
      query.category = { $regex: new RegExp(category, 'i') };
    }

    if (location) {
      query.location = { $regex: new RegExp(location, 'i') };
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Job.countDocuments(query);
    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: jobs,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc  Get a single job by ID
 * @route GET /api/jobs/:id
 * @access Public
 */
const getJobById = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.status(200).json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc  Create a new job listing
 * @route POST /api/jobs
 * @access Admin
 */
const createJob = async (req, res, next) => {
  try {
    const { title, company, location, category, description } = req.body;

    const job = await Job.create({ title, company, location, category, description });

    res.status(201).json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc  Delete a job listing
 * @route DELETE /api/jobs/:id
 * @access Admin
 */
const deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);

    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    res.status(200).json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { getJobs, getJobById, createJob, deleteJob };
