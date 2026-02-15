const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const { AppError } = require('../middleware/errorHandler');

// Initialize Razorpay
if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.error('⚠️ WARNING: Razorpay credentials not found in environment variables!');
  console.error('Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to your .env file');
}

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// @desc    Create payment order
// @route   POST /api/payments/create-order
// @access  Private
exports.createOrder = async (req, res, next) => {
  try {
    const { bookingId, amount, currency, bookingDetails } = req.body;

    // Validate Razorpay credentials
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
      throw new AppError('Payment gateway not configured. Please contact support.', 500);
    }

    // If bookingId is provided, use existing booking flow
    if (bookingId) {
      const booking = await Booking.findById(bookingId);

      if (!booking) {
        return next(new AppError('Booking not found', 404));
      }

      // Check authorization - user must own the booking
      if (req.user && booking.user.toString() !== req.user.id) {
        return next(new AppError('Not authorized to create payment for this booking', 403));
      }

      // Create Razorpay order
      const options = {
        amount: booking.totalAmount * 100, // amount in paise
        currency: 'INR',
        receipt: `receipt_${booking.bookingId}`,
        notes: {
          bookingId: booking._id.toString(),
          userId: booking.user.toString()
        }
      };

      const order = await razorpay.orders.create(options);

      // Create payment record
      const payment = await Payment.create({
        booking: booking._id,
        user: booking.user,
        amount: booking.totalAmount,
        currency: 'INR',
        provider: 'razorpay',
        providerOrderId: order.id,
        status: 'initiated',
        method: req.body.method || 'card'
      });

      res.status(201).json({
        status: 'success',
        data: {
          order,
          payment,
          key: process.env.RAZORPAY_KEY_ID
        }
      });
    } else {
      // Direct payment without booking (simplified flow for testing)
      const orderAmount = amount || 100; // Amount in rupees
      const orderCurrency = currency || 'INR';

      // Validate Razorpay credentials
      if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
        throw new AppError('Razorpay credentials not configured. Please add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env file', 500);
      }

      // Create Razorpay order
      const options = {
        amount: orderAmount * 100, // amount in paise
        currency: orderCurrency,
        receipt: `receipt_${Date.now()}`,
        notes: bookingDetails || {}
      };

      const order = await razorpay.orders.create(options);

      res.status(201).json({
        status: 'success',
        data: {
          order,
          key: process.env.RAZORPAY_KEY_ID
        }
      });
    }
  } catch (error) {
    console.error('Error creating Razorpay order:', error.message);
    next(error);
  }
};

// @desc    Verify payment
// @route   POST /api/payments/verify
// @access  Private
exports.verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentId
    } = req.body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return next(new AppError('Missing required payment verification fields', 400));
    }

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature !== expectedSign) {
      return next(new AppError('Invalid payment signature', 400));
    }

    // If paymentId is provided, update payment record
    if (paymentId) {
      const payment = await Payment.findById(paymentId);

      if (payment) {
        payment.status = 'success';
        payment.providerTransactionId = razorpay_payment_id;
        payment.invoice = {
          invoiceNumber: `INV-${Date.now()}`,
          invoiceUrl: null // Generate PDF invoice here
        };
        await payment.save();

        // Update booking
        const booking = await Booking.findById(payment.booking);
        if (booking) {
          booking.status = 'confirmed';
          booking.payment = payment._id;
          await booking.save();
        }

        res.status(200).json({
          status: 'success',
          message: 'Payment verified successfully',
          data: { payment, booking }
        });
      } else {
        return next(new AppError('Payment not found', 404));
      }
    } else {
      // Simplified verification without payment record (for testing)
      res.status(200).json({
        status: 'success',
        message: 'Payment verified successfully',
        data: {
          razorpay_order_id,
          razorpay_payment_id,
          verified: true
        }
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error.message);
    next(error);
  }
};

// @desc    Get payment by ID
// @route   GET /api/payments/:id
// @access  Private
exports.getPaymentById = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('booking user');

    if (!payment) {
      return next(new AppError('Payment not found', 404));
    }

    if (payment.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new AppError('Not authorized', 403));
    }

    res.status(200).json({
      status: 'success',
      data: { payment }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get invoice
// @route   GET /api/payments/:id/invoice
// @access  Private
exports.getInvoice = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate({
        path: 'booking',
        populate: { path: 'movie theatre' }
      })
      .populate('user');

    if (!payment) {
      return next(new AppError('Payment not found', 404));
    }

    if (payment.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new AppError('Not authorized', 403));
    }

    // Generate invoice data
    const invoice = {
      invoiceNumber: payment.invoice.invoiceNumber,
      date: payment.createdAt,
      user: {
        name: payment.user.name,
        email: payment.user.email,
        phone: payment.user.phone
      },
      booking: {
        bookingId: payment.booking.bookingId,
        movie: payment.booking.movie.title,
        theatre: payment.booking.theatre.name,
        date: payment.booking.showDate,
        time: payment.booking.showTime,
        seats: payment.booking.seats
      },
      payment: {
        amount: payment.amount,
        method: payment.method,
        transactionId: payment.providerTransactionId,
        status: payment.status
      }
    };

    res.status(200).json({
      status: 'success',
      data: { invoice }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Process refund (Admin)
// @route   POST /api/payments/:id/refund
// @access  Private/Admin
exports.processRefund = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return next(new AppError('Payment not found', 404));
    }

    if (payment.refund.isRefunded) {
      return next(new AppError('Payment already refunded', 400));
    }

    const { refundAmount, refundReason } = req.body;

    // Process refund with Razorpay
    const refund = await razorpay.payments.refund(payment.providerTransactionId, {
      amount: refundAmount * 100,
      notes: {
        reason: refundReason
      }
    });

    payment.refund = {
      isRefunded: true,
      refundAmount,
      refundDate: Date.now(),
      refundTransactionId: refund.id,
      refundReason
    };
    payment.status = 'refunded';
    await payment.save();

    // Update booking
    const booking = await Booking.findById(payment.booking);
    booking.cancellation.refundStatus = 'processed';
    await booking.save();

    res.status(200).json({
      status: 'success',
      message: 'Refund processed successfully',
      data: { payment }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user payment history
// @route   GET /api/payments/user/history
// @access  Private
exports.getPaymentHistory = async (req, res, next) => {
  try {
    const payments = await Payment.find({ user: req.user.id })
      .populate('booking')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      data: { payments }
    });
  } catch (error) {
    next(error);
  }
};
