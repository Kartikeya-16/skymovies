const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const { paymentValidation } = require('../middleware/requestValidator');
const {
  createOrder,
  verifyPayment,
  getPaymentById,
  getInvoice,
  processRefund,
  getPaymentHistory
} = require('../controllers/paymentController');

const router = express.Router();

// Protected routes - require authentication
router.use(protect);

router.post('/create-order', paymentValidation.createOrder, createOrder);
router.post('/verify', paymentValidation.verify, verifyPayment);
router.get('/user/history', getPaymentHistory);
router.get('/:id', getPaymentById);
router.get('/:id/invoice', getInvoice);

// Admin route
router.post('/:id/refund', authorize('admin'), processRefund);

module.exports = router;

