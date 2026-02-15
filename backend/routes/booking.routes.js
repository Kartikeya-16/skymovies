const express = require('express');
const { protect } = require('../middleware/auth');
const { bookingValidation } = require('../middleware/requestValidator');
const {
  createBooking,
  getUserBookings,
  getBookingById,
  confirmBooking,
  cancelBooking,
  checkSeatAvailability
} = require('../controllers/bookingController');

const router = express.Router();

// Public route
router.get('/seats/availability', checkSeatAvailability);

// Protected routes
router.use(protect);

router.post('/', bookingValidation.create, createBooking);
router.get('/', getUserBookings);
router.get('/:id', getBookingById);
router.put('/:id/confirm', confirmBooking);
router.put('/:id/cancel', bookingValidation.cancel, cancelBooking);

module.exports = router;

