// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);

  // Multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ 
      error: 'File too large. Maximum size is 5MB.' 
    });
  }

  if (err.code === 'LIMIT_FILE_COUNT') {
    return res.status(400).json({ 
      error: 'Too many files uploaded.' 
    });
  }

  if (err.message.includes('Invalid file type')) {
    return res.status(400).json({ 
      error: err.message 
    });
  }

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ 
      error: 'Validation Error', 
      details: messages 
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({ 
      error: 'Duplicate entry found.' 
    });
  }

  // Mongoose cast error (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({ 
      error: 'Invalid ID format.' 
    });
  }

  // Default error
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
};

// Not found middleware
const notFound = (req, res, next) => {
  res.status(404).json({ 
    error: 'Route not found' 
  });
};

module.exports = { errorHandler, notFound };
