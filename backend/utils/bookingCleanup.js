const Booking = require('../models/Booking');
const Showtime = require('../models/Showtime');

/**
 * Clean up expired bookings and release seats
 * This should be run periodically (e.g., every 5 minutes)
 */
const cleanupExpiredBookings = async () => {
  try {
    const now = new Date();
    
    // Find all expired pending bookings
    const expiredBookings = await Booking.find({
      status: 'pending',
      expiresAt: { $lt: now }
    });

    if (expiredBookings.length === 0) {
      return { cleaned: 0 };
    }

    console.log(`🧹 Cleaning up ${expiredBookings.length} expired bookings...`);

    let cleanedCount = 0;

    for (const booking of expiredBookings) {
      try {
        // Update booking status
        booking.status = 'expired';
        await booking.save();

        // Release seats
        const showtime = await Showtime.findById(booking.showtime);
        if (showtime) {
          // Remove blocked seats
          showtime.seats.booked = showtime.seats.booked.filter(
            s => s.bookingId.toString() !== booking._id.toString()
          );
          
          // Increase available seats
          showtime.seats.available += booking.seats.length;
          await showtime.save();
          
          cleanedCount++;
        }
      } catch (error) {
        console.error(`Error cleaning booking ${booking.bookingId}:`, error.message);
      }
    }

    console.log(`✅ Cleaned up ${cleanedCount} expired bookings`);
    return { cleaned: cleanedCount };
  } catch (error) {
    console.error('Error in booking cleanup:', error);
    throw error;
  }
};

/**
 * Start the cleanup job
 * Runs every 5 minutes
 */
const startCleanupJob = () => {
  // Run immediately on start
  cleanupExpiredBookings();
  
  // Then run every 5 minutes
  setInterval(cleanupExpiredBookings, 5 * 60 * 1000);
  
  console.log('🔄 Booking cleanup job started (runs every 5 minutes)');
};

module.exports = {
  cleanupExpiredBookings,
  startCleanupJob
};
