const errorHandler = (err, req, res, next) => {
  const isDev = process.env.NODE_ENV === 'development' || process.env.APP === 'dev';

  // Validation errors from express-validator
  if (err.type === 'validation') {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: err.errors
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }

  // Default
  const status = err.status || err.statusCode || 500;
  return res.status(status).json({
    success: false,
    error: isDev ? err.message : 'Internal server error',
    ...(isDev && { stack: err.stack })
  });
};

module.exports = errorHandler;
