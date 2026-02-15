const { body, param, query, validationResult } = require('express-validator');

// Validation error handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map(err => ({
      field: err.param,
      message: err.msg,
      value: err.value
    }));
    
    return res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      errors: extractedErrors
    });
  }
  
  next();
};

// Booking validation rules
const bookingValidation = {
  create: [
    body('showtimeId')
      .notEmpty().withMessage('Showtime ID is required')
      .isMongoId().withMessage('Invalid showtime ID'),
    body('seats')
      .isArray({ min: 1, max: 10 }).withMessage('Please select 1-10 seats')
      .custom((seats) => {
        // Validate each seat
        for (const seat of seats) {
          if (!seat.seatId || !seat.category) {
            throw new Error('Each seat must have seatId and category');
          }
          if (!['Premium', 'Gold', 'Platinum'].includes(seat.category)) {
            throw new Error('Invalid seat category');
          }
          // Validate seat ID format (e.g., A1, B12)
          if (!/^[A-Z]\d{1,2}$/.test(seat.seatId)) {
            throw new Error('Invalid seat ID format');
          }
        }
        return true;
      }),
    handleValidationErrors
  ],
  
  cancel: [
    param('id')
      .isMongoId().withMessage('Invalid booking ID'),
    handleValidationErrors
  ]
};

// Payment validation rules
const paymentValidation = {
  createOrder: [
    body('amount')
      .optional()
      .isFloat({ min: 1 }).withMessage('Amount must be greater than 0'),
    body('currency')
      .optional()
      .isIn(['INR', 'USD']).withMessage('Invalid currency'),
    body('bookingId')
      .optional()
      .isMongoId().withMessage('Invalid booking ID'),
    handleValidationErrors
  ],
  
  verify: [
    body('razorpay_order_id')
      .notEmpty().withMessage('Order ID is required'),
    body('razorpay_payment_id')
      .notEmpty().withMessage('Payment ID is required'),
    body('razorpay_signature')
      .notEmpty().withMessage('Signature is required'),
    handleValidationErrors
  ]
};

// User validation rules
const userValidation = {
  updateProfile: [
    body('name')
      .optional()
      .trim()
      .isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
    body('phone')
      .optional()
      .matches(/^[6-9]\d{9}$/).withMessage('Invalid Indian phone number'),
    body('dateOfBirth')
      .optional()
      .isISO8601().withMessage('Invalid date format')
      .custom((value) => {
        const age = (new Date() - new Date(value)) / (1000 * 60 * 60 * 24 * 365);
        if (age < 13) {
          throw new Error('Must be at least 13 years old');
        }
        return true;
      }),
    body('gender')
      .optional()
      .isIn(['male', 'female', 'other']).withMessage('Invalid gender'),
    handleValidationErrors
  ],
  
  addToWatchlist: [
    body('tmdbId')
      .notEmpty().withMessage('TMDB ID is required')
      .isInt({ min: 1 }).withMessage('Invalid TMDB ID'),
    handleValidationErrors
  ]
};

// Search validation rules
const searchValidation = {
  search: [
    query('q')
      .notEmpty().withMessage('Search query is required')
      .trim()
      .isLength({ min: 2, max: 100 }).withMessage('Query must be 2-100 characters'),
    query('page')
      .optional()
      .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 50 }).withMessage('Limit must be 1-50'),
    handleValidationErrors
  ]
};

module.exports = {
  bookingValidation,
  paymentValidation,
  userValidation,
  searchValidation,
  handleValidationErrors
};
