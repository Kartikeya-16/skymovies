const Booking = require('../models/Booking');
const Showtime = require('../models/Showtime');
const Payment = require('../models/Payment');
const { AppError } = require('../middleware/errorHandler');
const qrCodeGenerator = require('../utils/qrCodeGenerator');

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res, next) => {
  try {
    const { showtimeId, seats } = req.body;

    // Get showtime
    const showtime = await Showtime.findById(showtimeId)
      .populate('movie theatre');

    if (!showtime) {
      return next(new AppError('Showtime not found', 404));
    }

    // Check seat availability
    for (const seat of seats) {
      if (!showtime.isSeatAvailable(seat.seatId)) {
        return next(new AppError(`Seat ${seat.seatId} is not available`, 400));
      }
    }

    // Calculate total amount
    let totalAmount = 0;
    const bookedSeats = seats.map(seat => {
      const price = showtime.calculatePrice(seat.category);
      totalAmount += price;
      return {
        seatId: seat.seatId,
        category: seat.category,
        price
      };
    });

    // Create booking
    const booking = await Booking.create({
      user: req.user.id,
      movie: showtime.movie._id,
      showtime: showtimeId,
      theatre: showtime.theatre._id,
      seats: bookedSeats,
      totalAmount,
      showDate: showtime.date,
      showTime: showtime.startTime,
      status: 'pending'
    });

    // Block seats temporarily (15 minutes)
    for (const seat of bookedSeats) {
      showtime.seats.booked.push({
        seatId: seat.seatId,
        bookingId: booking._id,
        status: 'blocked'
      });
    }
    showtime.seats.available -= bookedSeats.length;
    await showtime.save();

    // Set timeout to release seats if not paid
    setTimeout(async () => {
      const checkBooking = await Booking.findById(booking._id);
      if (checkBooking.status === 'pending') {
        checkBooking.status = 'expired';
        await checkBooking.save();
        
        // Release seats
        const releaseShowtime = await Showtime.findById(showtimeId);
        bookedSeats.forEach(seat => {
          releaseShowtime.seats.booked = releaseShowtime.seats.booked.filter(
            s => s.bookingId.toString() !== booking._id.toString()
          );
        });
        releaseShowtime.seats.available += bookedSeats.length;
        await releaseShowtime.save();
      }
    }, 15 * 60 * 1000); // 15 minutes

    res.status(201).json({
      status: 'success',
      data: { booking }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings
// @access  Private
exports.getUserBookings = async (req, res, next) => {
  try {
    const { status } = req.query;

    const query = { user: req.user.id };
    if (status) {
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate('movie', 'title posterPath')
      .populate('theatre', 'name location')
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: 'success',
      data: { bookings }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('movie theatre showtime payment');

    if (!booking) {
      return next(new AppError('Booking not found', 404));
    }

    // Check ownership
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new AppError('Not authorized to access this booking', 403));
    }

    res.status(200).json({
      status: 'success',
      data: { booking }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Confirm booking after payment
// @route   PUT /api/bookings/:id/confirm
// @access  Private
exports.confirmBooking = async (req, res, next) => {
  try {
    const { paymentId } = req.body;

    const booking = await Booking.findById(req.params.id)
      .populate('movie theatre');

    if (!booking) {
      return next(new AppError('Booking not found', 404));
    }

    if (booking.user.toString() !== req.user.id) {
      return next(new AppError('Not authorized', 403));
    }

    // Update booking status
    booking.status = 'confirmed';
    booking.payment = paymentId;

    // Generate QR code
    const qrData = {
      bookingId: booking.bookingId,
      movie: booking.movie.title,
      theatre: booking.theatre.name,
      date: booking.showDate,
      time: booking.showTime,
      seats: booking.seats.map(s => s.seatId).join(', ')
    };

    booking.qrCode = await qrCodeGenerator.generate(JSON.stringify(qrData));
    await booking.save();

    // Update showtime - confirm seats
    const showtime = await Showtime.findById(booking.showtime);
    booking.seats.forEach(seat => {
      const seatIndex = showtime.seats.booked.findIndex(
        s => s.seatId === seat.seatId && s.bookingId.toString() === booking._id.toString()
      );
      if (seatIndex >= 0) {
        showtime.seats.booked[seatIndex].status = 'booked';
      }
    });
    await showtime.save();

    // Email confirmation removed - will be handled separately later
    console.log('✅ Booking confirmed:', booking.bookingId);

    res.status(200).json({
      status: 'success',
      data: { booking }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return next(new AppError('Booking not found', 404));
    }

    if (booking.user.toString() !== req.user.id) {
      return next(new AppError('Not authorized', 403));
    }

    if (booking.status !== 'confirmed') {
      return next(new AppError('Only confirmed bookings can be cancelled', 400));
    }

    // Check if show is more than 2 hours away
    const showDateTime = new Date(`${booking.showDate} ${booking.showTime}`);
    const hoursUntilShow = (showDateTime - Date.now()) / (1000 * 60 * 60);

    if (hoursUntilShow < 2) {
      return next(new AppError('Cannot cancel booking less than 2 hours before show', 400));
    }

    // Calculate refund (90% of total)
    const refundAmount = booking.totalAmount * 0.9;

    booking.status = 'cancelled';
    booking.cancellation = {
      isCancelled: true,
      cancelledAt: Date.now(),
      refundAmount,
      refundStatus: 'pending'
    };
    await booking.save();

    // Release seats
    const showtime = await Showtime.findById(booking.showtime);
    booking.seats.forEach(seat => {
      showtime.seats.booked = showtime.seats.booked.filter(
        s => !(s.seatId === seat.seatId && s.bookingId.toString() === booking._id.toString())
      );
    });
    showtime.seats.available += booking.seats.length;
    await showtime.save();

    // Process refund
    // This would integrate with payment gateway

    res.status(200).json({
      status: 'success',
      message: 'Booking cancelled successfully',
      data: { booking, refundAmount }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check seat availability
// @route   GET /api/bookings/seats/availability
// @access  Public
exports.checkSeatAvailability = async (req, res, next) => {
  try {
    const { showtimeId } = req.query;

    const showtime = await Showtime.findById(showtimeId);

    if (!showtime) {
      return next(new AppError('Showtime not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        totalSeats: showtime.seats.total,
        availableSeats: showtime.seats.available,
        bookedSeats: showtime.seats.booked.map(s => s.seatId)
      }
    });
  } catch (error) {
    next(error);
  }
};
