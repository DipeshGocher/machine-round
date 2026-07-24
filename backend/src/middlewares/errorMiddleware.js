import { ApiError } from '../utils/apiError.js';
import { HTTP_STATUS } from '../utils/statusCodes.js';

export const errorMiddleware = (err, req, res, next) => {
  let error = err;

  // Handle Mongoose duplicate key error (11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const message = `Duplicate ${field}: value already exists.`;
    error = new ApiError(HTTP_STATUS.CONFLICT, message);
  }

  // Handle Mongoose ValidationError
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
    error = new ApiError(HTTP_STATUS.BAD_REQUEST, message);
  }

  // Handle invalid Mongoose ObjectId CastError
  if (err.name === 'CastError') {
    const message = `Invalid ${err.path}: ${err.value}`;
    error = new ApiError(HTTP_STATUS.BAD_REQUEST, message);
  }

  const statusCode = error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = error.message || 'Internal Server Error';

  return res.status(statusCode).json({
    statusCode,
    success: false,
    message,
    errors: error.errors || [],
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};
