const Movie = require('../models/Movie');
const { AppError } = require('../middleware/errorHandler');

// @desc    Search movies
// @route   GET /api/search/movies
// @access  Public
exports.searchMovies = async (req, res, next) => {
  try {
    const { q, page = 1, limit = 20 } = req.query;

    if (!q) {
      return next(new AppError('Please provide search query', 400));
    }

    // Text search
    const movies = await Movie.find(
      {
        $text: { $search: q },
        isActive: true
      },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Movie.countDocuments({
      $text: { $search: q },
      isActive: true
    });

    res.status(200).json({
      status: 'success',
      data: {
        movies,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        total: count
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get search suggestions
// @route   GET /api/search/suggestions
// @access  Public
exports.getSuggestions = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q || q.length < 2) {
      return res.status(200).json({
        status: 'success',
        data: { suggestions: [] }
      });
    }

    const suggestions = await Movie.find({
      title: { $regex: q, $options: 'i' },
      isActive: true
    })
      .select('title releaseDate posterPath')
      .limit(10);

    res.status(200).json({
      status: 'success',
      data: { suggestions }
    });
  } catch (error) {
    next(error);
  }
};
