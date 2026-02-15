const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  bookingId: {
    type: String,
    unique: true,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  showtime: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Showtime',
    required: true
  },
  theatre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theatre',
    required: true
  },
  seats: [{
    seatId: {
      type: String,
      required: true
    },
    category: {
      type: String,
      enum: ['Premium', 'Gold', 'Platinum'],
      required: true
    },
    price: {
      type: Number,
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: true
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  showDate: {
    type: Date,
    required: true
  },
  showTime: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'expired'],
    default: 'pending'
  },
  expiresAt: {
    type: Date,
    index: true
  },
  payment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Payment'
  },
  qrCode: String,
  cancellation: {
    isCancelled: {
      type: Boolean,
      default: false
    },
    cancelledAt: Date,
    refundAmount: Number,
    refundStatus: {
      type: String,
      enum: ['pending', 'processed', 'failed']
    }
  }
}, {
  timestamps: true
});

// Generate unique booking ID
bookingSchema.pre('save', async function(next) {
  if (!this.bookingId) {
    this.bookingId = 'BK' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase();
  }
  next();
});

// Indexes
bookingSchema.index({ user: 1, createdAt: -1 });
bookingSchema.index({ bookingId: 1 }, { unique: true });
bookingSchema.index({ status: 1 });
bookingSchema.index({ showDate: 1 });
bookingSchema.index({ expiresAt: 1 }, { sparse: true });
bookingSchema.index({ user: 1, status: 1 });
bookingSchema.index({ showtime: 1, status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);

