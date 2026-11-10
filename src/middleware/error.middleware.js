const ApiError = require('../utils/ApiError');
const env = require('../config/env');

function notFound(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

function errorHandler(err, req, res, next) {
  let error = err;

  if (error.code === 11000) {
    error = new ApiError(409, 'Resource already exists.');
  }

  if (error.type === 'entity.parse.failed') {
    error = new ApiError(400, 'Invalid JSON in request body.');
  }

  if (!(error instanceof ApiError)) {
    error = new ApiError(
      error.statusCode || 500,
      error.message || 'Internal server error'
    );
  }

  const body = {
    success: false,
    message: error.message
  };

  if (error.details && error.details.length > 0) {
    body.details = error.details;
  }

  if (env.NODE_ENV === 'development') {
    body.stack = err.stack;
  }

  res.status(error.statusCode).json(body);
}

module.exports = {
  notFound,
  errorHandler
};