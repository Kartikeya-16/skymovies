const express = require('express');
const { protect } = require('../middleware/auth');
const {
  getProfile,
  updateProfile,
  changePassword,
  getWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  getLibrary,
  getWatchHistory,
  updateWatchProgress,
  getContinueWatching
} = require('../controllers/userController');

const router = express.Router();

// All routes are protected
router.use(protect);

// Profile routes
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);

// Watchlist routes
router.get('/watchlist', getWatchlist);
router.post('/watchlist/:movieId', addToWatchlist);
router.delete('/watchlist/:movieId', removeFromWatchlist);

// Library and watch history
router.get('/library', getLibrary);
router.get('/watch-history', getWatchHistory);
router.post('/watch-progress', updateWatchProgress);
router.get('/continue-watching', getContinueWatching);

module.exports = router;

