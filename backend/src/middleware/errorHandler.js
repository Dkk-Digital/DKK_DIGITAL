// Enhanced error handler with comprehensive error handling
export const errorHandler = (err, req, res, next) => {
  // Log error with context
  const errorLog = {
    timestamp: new Date(),
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    method: req.method,
    path: req.path,
    ip: req.ip,
    userId: req.user?._id,
  };

  console.error('[ERROR]', errorLog);

  // Default error response
  let status = err.status || err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = [];

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    status = 400;
    message = 'Invalid ID format';
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    status = 400;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} already exists`;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    status = 400;
    const validationErrors = Object.values(err.errors).map((val) => ({
      field: val.path,
      message: val.message,
    }));
    message = 'Validation Error';
    errors = validationErrors;
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    status = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    status = 401;
    message = 'Token expired';
  }

  // Multer file upload errors
  if (err.name === 'MulterError') {
    status = 400;
    if (err.code === 'FILE_TOO_LARGE') {
      message = 'File too large';
    } else if (err.code === 'LIMIT_FILE_COUNT') {
      message = 'Too many files';
    } else {
      message = 'File upload error';
    }
  }

  // Send response
  res.status(status).json({
    success: false,
    message,
    ...(errors.length > 0 && { errors }),
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

// Async error wrapper to catch errors in async route handlers
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default errorHandler;
