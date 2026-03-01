// ==================== ERROR HANDLER MIDDLEWARE ====================
// Centralized error handling for the entire application
export const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error('Error:', err);

  // Default error response
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation failed - please check your input';
    const errors = Object.values(err.errors).map((error) => error.message);
    return res.status(statusCode).json({
      error: message,
      userMessage: 'Some required fields are missing or invalid. Please check the details below and try again.',
      details: errors,
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyPattern)[0];
    message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    return res.status(statusCode).json({
      error: message,
      userMessage: `This ${field} has already been registered. Please use a different ${field} or contact support if you need help.`,
    });
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
    return res.status(statusCode).json({
      error: message,
      userMessage: 'The ID you provided is not valid. Please check the URL or ID and try again.',
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
    return res.status(statusCode).json({
      error: message,
      userMessage: 'Your session token is invalid. Please log in again to continue.',
    });
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Session expired';
    return res.status(statusCode).json({
      error: message,
      userMessage: 'Your session has expired. Please log in again to continue.',
    });
  }

  // Generic error response
  res.status(statusCode).json({
    error: message,
    userMessage: statusCode === 500 
      ? 'Something went wrong on our end. Please try again later or contact support.'
      : 'An error occurred. Please check your input and try again.',
    ...(process.env.NODE_ENV === 'development' && { details: err.stack }),
  });
};

// ==================== ASYNC ERROR WRAPPER ====================
// Wrapper to catch errors in async route handlers
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default errorHandler;
