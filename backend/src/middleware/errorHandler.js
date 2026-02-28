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
  // Mongoose bad ObjectId
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    return res.status(404).json({
      success: false,
      message: 'Resource not found',
    });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    return res.status(409).json({
      success: false,
      message: 'Duplicate field value entered',
    });
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(422).json({
      success: false,
      message: 'Validation failed',
      errors: messages,
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
