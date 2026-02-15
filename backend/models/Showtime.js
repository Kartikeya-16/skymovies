const mongoose = require('mongoose');

const showtimeSchema = new mongoose.Schema({
  movie: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  theatre: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theatre',
    required: true
  },
  screen: {
    screenNumber: {
      type: Number,
      required: true
    },
    name: String
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true // Format: "HH:MM" e.g., "10:00", "14:30"
  },
  endTime: String,
  pricing: [{
    category: {
      type: String,
      enum: ['Premium', 'Gold', 'Platinum'],
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    dynamicPricing: {
      enabled: {
        type: Boolean,
        default: false
      },
      peakHours: {
        enabled: Boolean,
        multiplier: Number // e.g., 1.2 for 20% increase
      },
      weekendMultiplier: Number
    }
  }],
  seats: {
    total: {
      type: Number,
      required: true
    },
    available: {
      type: Number,
      required: true
    },
    booked: [{
      seatId: String, // e.g., "A5", "B12"
      bookingId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking'
      },
      status: {
        type: String,
        enum: ['booked', 'blocked', 'available'],
        default: 'booked'
      }
    }]
  },
  language: String,
  format: {
    type: String,
    enum: ['2D', '3D', 'IMAX', 'IMAX 3D', '4DX'],
    default: '2D'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes
showtimeSchema.index({ movie: 1, theatre: 1, date: 1 });
showtimeSchema.index({ date: 1, startTime: 1 });
showtimeSchema.index({ theatre: 1, date: 1 });
showtimeSchema.index({ isActive: 1 });
showtimeSchema.index({ date: 1, isActive: 1 });

// Method to check seat availability
showtimeSchema.methods.isSeatAvailable = function(seatId) {
  const seat = this.seats.booked.find(s => s.seatId === seatId);
  return !seat || seat.status === 'available';
};

// Method to calculate price with dynamic pricing
showtimeSchema.methods.calculatePrice = function(category) {
  const pricing = this.pricing.find(p => p.category === category);
  if (!pricing) return null;
  
  let price = pricing.price;
  
  if (pricing.dynamicPricing && pricing.dynamicPricing.enabled) {
    const date = new Date(this.date);
    const hour = parseInt(this.startTime.split(':')[0]);
    
    // Weekend pricing
    if ([0, 6].includes(date.getDay()) && pricing.dynamicPricing.weekendMultiplier) {
      price *= pricing.dynamicPricing.weekendMultiplier;
    }
    
    // Peak hours pricing (evening shows)
    if (hour >= 18 && hour <= 23 && pricing.dynamicPricing.peakHours?.enabled) {
      price *= pricing.dynamicPricing.peakHours.multiplier;
    }
  }
  
  return Math.round(price);
};

module.exports = mongoose.model('Showtime', showtimeSchema);

