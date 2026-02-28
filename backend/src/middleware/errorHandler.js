/**
 * 404 handler – mounted after all routes to catch unmatched paths.
 */
const notFound = (req, res, next) => {
  const error = new Error(`Not Found – ${req.originalUrl}`);
  error.status = 404;
  next(error);
};

/**
 * Global error handler – must have four parameters so Express recognises it
 * as an error-handling middleware.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  // PostgreSQL foreign key violation (e.g. referencing a non-existent job)
  if (err.code === '23503') {
    return res.status(404).json({
      success: false,
      message: 'Referenced resource not found',
    });
  }

  // PostgreSQL unique constraint violation
  if (err.code === '23505') {
    return res.status(409).json({
      success: false,
      message: 'Duplicate field value entered',
    });
  }

  // PostgreSQL not-null / check constraint violation
  if (err.code === '23502' || err.code === '23514') {
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: [err.detail || err.message],
    });
  }

  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = { notFound, errorHandler };
