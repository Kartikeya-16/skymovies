const User = require('../models/User');
const Movie = require('../models/Movie');
const { AppError } = require('../middleware/errorHandler');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .populate('watchlist', 'title posterPath releaseDate')
      .populate('purchasedMovies.movieId', 'title posterPath');

    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, dateOfBirth, gender, preferences } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { name, phone, dateOfBirth, gender, preferences },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id).select('+password');

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return next(new AppError('Current password is incorrect', 400));
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Password changed successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get watchlist
// @route   GET /api/users/watchlist
// @access  Private
exports.getWatchlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('watchlist');

    res.status(200).json({
      status: 'success',
      data: { watchlist: user.watchlist }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add to watchlist
// @route   POST /api/users/watchlist/:movieId
// @access  Private
exports.addToWatchlist = async (req, res, next) => {
  try {
    const { movieId } = req.params;

    const user = await User.findById(req.user.id);

    if (user.watchlist.includes(movieId)) {
      return next(new AppError('Movie already in watchlist', 400));
    }

    user.watchlist.push(movieId);
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Added to watchlist'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove from watchlist
// @route   DELETE /api/users/watchlist/:movieId
// @access  Private
exports.removeFromWatchlist = async (req, res, next) => {
  try {
    const { movieId } = req.params;

    const user = await User.findById(req.user.id);
    user.watchlist = user.watchlist.filter(id => id.toString() !== movieId);
    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Removed from watchlist'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get purchased movies
// @route   GET /api/users/library
// @access  Private
exports.getLibrary = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('purchasedMovies.movieId');

    res.status(200).json({
      status: 'success',
      data: { library: user.purchasedMovies }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get watch history
// @route   GET /api/users/watch-history
// @access  Private
exports.getWatchHistory = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('watchHistory.movieId');

    res.status(200).json({
      status: 'success',
      data: { watchHistory: user.watchHistory }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update watch progress
// @route   POST /api/users/watch-progress
// @access  Private
exports.updateWatchProgress = async (req, res, next) => {
  try {
    const { movieId, progress } = req.body;

    const user = await User.findById(req.user.id);

    const existingIndex = user.watchHistory.findIndex(
      item => item.movieId.toString() === movieId
    );

    if (existingIndex >= 0) {
      user.watchHistory[existingIndex].progress = progress;
      user.watchHistory[existingIndex].lastWatched = Date.now();
    } else {
      user.watchHistory.push({ movieId, progress, lastWatched: Date.now() });
    }

    await user.save();

    res.status(200).json({
      status: 'success',
      message: 'Progress updated'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get continue watching
// @route   GET /api/users/continue-watching
// @access  Private
exports.getContinueWatching = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('watchHistory.movieId');

    const continueWatching = user.watchHistory
      .filter(item => item.progress > 0 && item.progress < 90)
      .sort((a, b) => b.lastWatched - a.lastWatched)
      .slice(0, 10);

    res.status(200).json({
      status: 'success',
      data: { continueWatching }
    });
  } catch (error) {
    next(error);
  }
};
