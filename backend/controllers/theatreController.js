const Theatre = require('../models/Theatre');
const Showtime = require('../models/Showtime');
const { AppError } = require('../middleware/errorHandler');

// @desc    Get all theatres
// @route   GET /api/theatres
// @access  Public
exports.getAllTheatres = async (req, res, next) => {
  try {
    const { city } = req.query;

    const query = { isActive: true };
    if (city) {
      query['location.city'] = new RegExp(city, 'i');
    }

    const theatres = await Theatre.find(query);

    res.status(200).json({
      status: 'success',
      data: { theatres }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get theatre by ID
// @route   GET /api/theatres/:id
// @access  Public
exports.getTheatreById = async (req, res, next) => {
  try {
    const theatre = await Theatre.findById(req.params.id);

    if (!theatre) {
      return next(new AppError('Theatre not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { theatre }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get movies showing in theatre
// @route   GET /api/theatres/:id/movies
// @access  Public
exports.getTheatreMovies = async (req, res, next) => {
  try {
    const { date } = req.query;
    const theatreId = req.params.id;

    const query = {
      theatre: theatreId,
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
      .populate('movie')
      .sort({ date: 1, startTime: 1 });

    // Get unique movies
    const movies = [...new Map(showtimes.map(s => [s.movie._id.toString(), s.movie])).values()];

    res.status(200).json({
      status: 'success',
      data: { movies, showtimes }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create theatre (Admin)
// @route   POST /api/theatres
// @access  Private/Admin
exports.createTheatre = async (req, res, next) => {
  try {
    const theatre = await Theatre.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { theatre }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update theatre (Admin)
// @route   PUT /api/theatres/:id
// @access  Private/Admin
exports.updateTheatre = async (req, res, next) => {
  try {
    const theatre = await Theatre.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!theatre) {
      return next(new AppError('Theatre not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: { theatre }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete theatre (Admin)
// @route   DELETE /api/theatres/:id
// @access  Private/Admin
exports.deleteTheatre = async (req, res, next) => {
  try {
    const theatre = await Theatre.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!theatre) {
      return next(new AppError('Theatre not found', 404));
    }

    res.status(200).json({
      status: 'success',
      message: 'Theatre deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create showtime (Admin)
// @route   POST /api/theatres/showtimes
// @access  Private/Admin
exports.createShowtime = async (req, res, next) => {
  try {
    const showtime = await Showtime.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { showtime }
    });
  } catch (error) {
    next(error);
  }
};
