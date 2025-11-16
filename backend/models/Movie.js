const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  tmdbId: {
    type: Number,
    unique: true,
    sparse: true
  },
  title: {
    type: String,
    required: [true, 'Please provide a movie title'],
    trim: true
  },
  originalTitle: String,
  overview: {
    type: String,
    required: [true, 'Please provide movie overview']
  },
  releaseDate: Date,
  runtime: Number, // in minutes
  genres: [{
    id: Number,
    name: String
  }],
  posterPath: String,
  backdropPath: String,
  voteAverage: {
    type: Number,
    min: 0,
    max: 10
  },
  voteCount: Number,
  popularity: Number,
  
  // Additional metadata
  language: String,
  originalLanguage: String,
  adult: {
    type: Boolean,
    default: false
  },
  video: Boolean,
  
  // Cast and crew
  cast: [{
    id: Number,
    name: String,
    character: String,
    profilePath: String
  }],
  director: String,
  
  // Videos (trailers, teasers)
  videos: [{
    key: String,
    name: String,
    site: String,
    type: String
  }],
  
  // Availability
  availableIn: {
    type: String,
    enum: ['theatre', 'online', 'both'],
    default: 'theatre'
  },
  
  // For online streaming
  streamingDetails: {
    videoUrl: String,
    quality: [{
      type: String,
      enum: ['SD', 'HD', 'FHD', '4K']
    }],
    price: {
      rent: Number,
      buy: Number
    },
    subtitles: [{
      language: String,
      url: String
    }]
  },
  
  // For theatre
  theatreRelease: {
    isReleased: {
      type: Boolean,
      default: false
    },
    releaseStatus: {
      type: String,
      enum: ['coming_soon', 'now_showing', 'ended'],
      default: 'coming_soon'
    }
  },
  
  // Ratings and reviews
  ratings: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  
  // Metadata
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
movieSchema.index({ title: 'text', overview: 'text' });
movieSchema.index({ tmdbId: 1 });
movieSchema.index({ availableIn: 1 });
movieSchema.index({ 'theatreRelease.releaseStatus': 1 });
movieSchema.index({ releaseDate: -1 });
movieSchema.index({ popularity: -1 });

module.exports = mongoose.model('Movie', movieSchema);

