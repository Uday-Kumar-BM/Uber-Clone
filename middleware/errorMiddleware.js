const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

const errorHandler = (res, statusCode, message, stack = null) => {
    const status = statusCode || 500;
    res.status(status).json({
        message,
        stack: process.env.NODE_ENV === 'production' ? null : stack,
    });
};

// Overload for Express error handling middleware structure
const expressErrorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export { notFound, errorHandler, expressErrorHandler as errorHandler };
