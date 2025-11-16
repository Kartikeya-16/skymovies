const mongoose = require('mongoose');

const theatreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide theatre name'],
    trim: true
  },
  location: {
    address: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    state: String,
    pincode: String,
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  contact: {
    phone: String,
    email: String
  },
  screens: [{
    screenNumber: {
      type: Number,
      required: true
    },
    name: String,
    capacity: {
      type: Number,
      required: true
    },
    seatLayout: {
      rows: {
        type: Number,
        default: 8
      },
      seatsPerRow: {
        type: Number,
        default: 12
      },
      categories: [{
        name: {
          type: String,
          enum: ['Premium', 'Gold', 'Platinum'],
          required: true
        },
        rows: [String], // e.g., ['A', 'B', 'C']
        basePrice: {
          type: Number,
          required: true
        }
      }]
    },
    amenities: [String] // ['Dolby Atmos', '4K Projection', 'Recliner Seats']
  }],
  amenities: [String], // ['Parking', 'Food Court', 'Wheelchair Access']
  images: [String],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for location-based queries
theatreSchema.index({ 'location.city': 1 });
theatreSchema.index({ 'location.coordinates': '2dsphere' });

module.exports = mongoose.model('Theatre', theatreSchema);

