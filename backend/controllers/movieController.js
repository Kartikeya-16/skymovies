const Movie = require('../models/Movie');
const Showtime = require('../models/Showtime');
const { AppError } = require('../middleware/errorHandler');

// @desc    Get all movies with filters (Backend stored movies for booking/streaming)
// @route   GET /api/movies
// @access  Public
// Note: Frontend handles TMDB browsing, backend handles booking-enabled movies
exports.getAllMovies = async (req, res, next) => {
  try {
    const { 
      availableIn,
      city 
    } = req.query;

    const query = { isActive: true };

    // Only return movies that are actually available for booking/streaming
    if (availableIn) {
      query.availableIn = { $in: [availableIn, 'both'] };
    }

    const movies = await Movie.find(query)
      .select('tmdbId title availableIn theatreRelease streamingDetails')
      .sort({ popularity: -1 });

    res.status(200).json({
      status: 'success',
      data: { movies }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get theatre movies (TMDB IDs only - frontend fetches details)
// @route   GET /api/movies/theatre
// @access  Public
exports.getTheatreMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({
      availableIn: { $in: ['theatre', 'both'] },
      'theatreRelease.releaseStatus': { $in: ['now_showing', 'coming_soon'] },
      isActive: true
    })
    .select('tmdbId availableIn theatreRelease')
    .sort({ popularity: -1 });

    // Return TMDB IDs so frontend can fetch full details
    const tmdbIds = movies.map(m => ({
      tmdbId: m.tmdbId,
      _id: m._id,
      availableIn: m.availableIn,
      releaseStatus: m.theatreRelease.releaseStatus
    }));

    res.status(200).json({
      status: 'success',
      data: { movies: tmdbIds }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get online movies (TMDB IDs only - frontend fetches details)
// @route   GET /api/movies/online
// @access  Public
exports.getOnlineMovies = async (req, res, next) => {
  try {
    const movies = await Movie.find({
      availableIn: { $in: ['online', 'both'] },
      isActive: true
    })
    .select('tmdbId availableIn streamingDetails')
    .sort({ popularity: -1 });

    // Return TMDB IDs and streaming info
    const movieList = movies.map(m => ({
      tmdbId: m.tmdbId,
      _id: m._id,
      availableIn: m.availableIn,
      price: m.streamingDetails?.price
    }));

    res.status(200).json({
      status: 'success',
      data: { movies: movieList }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get movie by ID (Backend booking/streaming data)
// @route   GET /api/movies/:id
// @access  Public
// Note: Frontend gets full movie details from TMDB, backend provides booking availability
exports.getMovieById = async (req, res, next) => {
  try {
    const movie = await Movie.findById(req.params.id)
      .select('tmdbId availableIn theatreRelease streamingDetails');

    if (!movie) {
      return next(new AppError('Movie not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { movie }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get movie by TMDB ID (Check if bookable/streamable)
// @route   GET /api/movies/tmdb/:tmdbId
// @access  Public
exports.getMovieByTmdbId = async (req, res, next) => {
  try {
    const movie = await Movie.findOne({ tmdbId: req.params.tmdbId })
      .select('_id tmdbId availableIn theatreRelease streamingDetails');

    if (!movie) {
      return res.status(200).json({
        status: 'success',
        data: { 
          movie: null,
          bookable: false,
          streamable: false
        }
      });
    }

    res.status(200).json({
      status: 'success',
      data: { 
        movie,
        bookable: ['theatre', 'both'].includes(movie.availableIn),
        streamable: ['online', 'both'].includes(movie.availableIn)
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get movie showtimes
// @route   GET /api/movies/:id/showtimes
// @access  Public
exports.getMovieShowtimes = async (req, res, next) => {
  try {
    const { date } = req.query;
    const movieId = req.params.id;

    const query = {
      movie: movieId,
      isActive: true
    };

    if (date) {
      const searchDate = new Date(date);
      query.date = {
        $gte: new Date(searchDate.setHours(0, 0, 0, 0)),
        $lt: new Date(searchDate.setHours(23, 59, 59, 999))
      };
    } else {
      query.date = { $gte: new Date() };
    }

    const showtimes = await Showtime.find(query)
      .populate('theatre', 'name location')
      .sort({ date: 1, startTime: 1 });

    res.status(200).json({
      status: 'success',
      data: { showtimes }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get bookable/streamable movies from user's watchlist
// @route   GET /api/movies/user/recommendations
// @access  Private
// Note: Frontend handles TMDB recommendations, backend tracks which are bookable
exports.getRecommendations = async (req, res, next) => {
  try {
    // Return TMDB IDs of bookable movies
    const bookableMovies = await Movie.find({
      isActive: true,
      availableIn: { $in: ['theatre', 'online', 'both'] }
    })
    .select('tmdbId availableIn')
    .limit(20)
    .sort({ popularity: -1 });

    res.status(200).json({
      status: 'success',
      data: { 
        tmdbIds: bookableMovies.map(m => ({
          tmdbId: m.tmdbId,
          availableIn: m.availableIn
        }))
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create movie (Admin)
// @route   POST /api/movies
// @access  Private/Admin
exports.createMovie = async (req, res, next) => {
  try {
    const movie = await Movie.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { movie }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update movie (Admin)
// @route   PUT /api/movies/:id
// @access  Private/Admin
exports.updateMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!movie) {
      return next(new AppError('Movie not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { movie }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete movie (Admin)
// @route   DELETE /api/movies/:id
// @access  Private/Admin
exports.deleteMovie = async (req, res, next) => {
  try {
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!movie) {
      return next(new AppError('Movie not found', 404));
    }

    res.status(200).json({
      status: 'success',
      message: 'Movie deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Enable movie for booking/streaming (Admin)
// @route   POST /api/movies/enable/:tmdbId
// @access  Private/Admin
// Note: This just marks a TMDB movie as bookable/streamable
exports.enableMovie = async (req, res, next) => {
  try {
    const { tmdbId } = req.params;
    const { availableIn, theatreRelease, streamingDetails, title } = req.body;
    
    // Check if movie already exists
    let movie = await Movie.findOne({ tmdbId: parseInt(tmdbId) });
    
    if (movie) {
      // Update existing
      movie.availableIn = availableIn || movie.availableIn;
      if (theatreRelease) movie.theatreRelease = theatreRelease;
      if (streamingDetails) movie.streamingDetails = streamingDetails;
      movie.isActive = true;
      await movie.save();
    } else {
      // Create new with minimal data (frontend has full TMDB data)
      movie = await Movie.create({
        tmdbId: parseInt(tmdbId),
        title: title || `Movie ${tmdbId}`,
        overview: req.body.overview || 'Check TMDB for details',
        availableIn: availableIn || 'theatre',
        theatreRelease: theatreRelease || {
          isReleased: true,
          releaseStatus: 'now_showing'
        },
        streamingDetails: streamingDetails || {},
        isActive: true
      });
    }

    res.status(200).json({
      status: 'success',
      message: `Movie enabled for ${availableIn}`,
      data: { movie }
    });
  } catch (error) {
    next(error);
  }
};
