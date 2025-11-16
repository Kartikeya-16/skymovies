const express = require('express');
const { protect, authorize } = require('../middleware/auth');
const {
  getAllTheatres,
  getTheatreById,
  getTheatreMovies,
  createTheatre,
  updateTheatre,
  deleteTheatre,
  createShowtime
} = require('../controllers/theatreController');

const router = express.Router();

// Public routes
router.get('/', getAllTheatres);
router.get('/:id', getTheatreById);
router.get('/:id/movies', getTheatreMovies);

// Admin routes
router.post('/', protect, authorize('admin'), createTheatre);
router.put('/:id', protect, authorize('admin'), updateTheatre);
router.delete('/:id', protect, authorize('admin'), deleteTheatre);
router.post('/showtimes', protect, authorize('admin'), createShowtime);

module.exports = router;

