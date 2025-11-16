const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  createOrder,
  verifyPayment,
  getPaymentById,
  getInvoice,
  processRefund,
  getPaymentHistory
} = require('../controllers/paymentController');

const router = express.Router();

// Public routes (no auth required for now)
router.post('/create-order', createOrder);
router.post('/verify', verifyPayment);

// Protected routes (will be enabled when auth is implemented)
// router.use(protect);
router.get('/user/history', protect, getPaymentHistory);
router.get('/:id', protect, getPaymentById);
router.get('/:id/invoice', protect, getInvoice);

// Admin route
router.post('/:id/refund', protect, authorize('admin'), processRefund);

module.exports = router;

