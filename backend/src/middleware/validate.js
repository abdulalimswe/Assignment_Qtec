const { body, validationResult } = require('express-validator');

/**
 * Middleware that reads express-validator results and responds with 422
 * when validation errors are found.
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

/**
 * Validation rules for POST /api/jobs
 */
const validateJob = [
  body('title')
    .trim()
    .notEmpty().withMessage('Job title is required')
    .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),

  body('company')
    .trim()
    .notEmpty().withMessage('Company name is required')
    .isLength({ max: 100 }).withMessage('Company name cannot exceed 100 characters'),

  body('location')
    .trim()
    .notEmpty().withMessage('Location is required'),

  body('category')
    .trim()
    .notEmpty().withMessage('Category is required'),

  body('description')
    .trim()
    .notEmpty().withMessage('Job description is required'),

  handleValidationErrors,
];

/**
 * Validation rules for POST /api/applications
 */
const validateApplication = [
  body('jobId')
    .trim()
    .notEmpty().withMessage('Job ID is required')
    .isInt({ min: 1 }).withMessage('Job ID must be a positive integer')
    .toInt(),

  body('name')
    .trim()
    .notEmpty().withMessage('Applicant name is required')
    .isLength({ max: 100 }).withMessage('Name cannot exceed 100 characters'),

  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),

  body('resumeLink')
    .trim()
    .notEmpty().withMessage('Resume link is required')
    .isURL({ protocols: ['http', 'https'], require_protocol: true })
    .withMessage('Resume link must be a valid URL (http or https)'),

  body('coverNote')
    .optional()
    .trim(),

  handleValidationErrors,
];

module.exports = { validateJob, validateApplication };
