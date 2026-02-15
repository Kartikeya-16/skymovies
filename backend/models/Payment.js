const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  paymentId: {
    type: String,
    unique: true,
    required: true
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'INR'
  },
  method: {
    type: String,
    enum: ['upi', 'card', 'wallet', 'netbanking'],
    required: true
  },
  provider: {
    type: String, // razorpay, stripe, etc.
    default: 'razorpay'
  },
  providerTransactionId: String,
  providerOrderId: String,
  status: {
    type: String,
    enum: ['initiated', 'pending', 'success', 'failed', 'refunded'],
    default: 'initiated'
  },
  paymentDetails: {
    cardLast4: String,
    cardType: String,
    upiId: String,
    walletProvider: String
  },
  failureReason: String,
  invoice: {
    invoiceNumber: String,
    invoiceUrl: String
  },
  refund: {
    isRefunded: {
      type: Boolean,
      default: false
    },
    refundAmount: Number,
    refundDate: Date,
    refundTransactionId: String,
    refundReason: String
  }
}, {
  timestamps: true
});

// Generate unique payment ID
paymentSchema.pre('save', async function(next) {
  if (!this.paymentId) {
    this.paymentId = 'PAY' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
  }
  next();
});

// Indexes
paymentSchema.index({ user: 1, createdAt: -1 });
paymentSchema.index({ paymentId: 1 }, { unique: true });
paymentSchema.index({ status: 1 });
paymentSchema.index({ providerTransactionId: 1 });
paymentSchema.index({ providerOrderId: 1 });
paymentSchema.index({ booking: 1 });

module.exports = mongoose.model('Payment', paymentSchema);

