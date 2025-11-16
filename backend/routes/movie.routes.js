const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getAllMovies,
  getTheatreMovies,
  getOnlineMovies,
  getMovieById,
  getMovieByTmdbId,
  getMovieShowtimes,
  getRecommendations,
  createMovie,
  updateMovie,
  deleteMovie,
  enableMovie
} = require('../controllers/movieController');

const router = express.Router();

// Public routes
router.get('/', getAllMovies);
router.get('/theatre', getTheatreMovies);
router.get('/online', getOnlineMovies);
router.get('/tmdb/:tmdbId', getMovieByTmdbId); // Check if TMDB movie is bookable
router.get('/:id', getMovieById);
router.get('/:id/showtimes', getMovieShowtimes);
router.get('/:id/recommendations', getRecommendations);

// Admin routes - Enable/disable movies for booking
router.post('/enable/:tmdbId', protect, authorize('admin'), enableMovie);
router.post('/', protect, authorize('admin'), createMovie);
router.put('/:id', protect, authorize('admin'), updateMovie);
router.delete('/:id', protect, authorize('admin'), deleteMovie);

module.exports = router;

