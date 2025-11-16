const path = require('path');
const dotenv = require('dotenv');
const envPath = path.resolve(__dirname, '../.env');
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error('❌ Error loading .env file:', result.error);
  process.exit(1);
}
const mongoose = require('mongoose');
const User = require('../models/User');
const Movie = require('../models/Movie');
const Theatre = require('../models/Theatre');
const Showtime = require('../models/Showtime');

// Debug: Check if MONGODB_URI is loaded
if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI is not defined in .env file');
  process.exit(1);
}

console.log('📡 Connecting to MongoDB...');
console.log('URI:', process.env.MONGODB_URI.replace(/\/\/.*@/, '//***@')); // Hide credentials

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch((err) => {
  console.error('❌ MongoDB Connection Error:', err);
  process.exit(1);
});

// Sample data
const users = [
  {
    name: 'Admin User',
    email: process.env.ADMIN_EMAIL || 'admin@moviebooking.com',
    password: process.env.ADMIN_PASSWORD || 'Admin@123',
    role: 'admin',
    phone: '+91 9876543210'
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user',
    phone: '+91 9876543211'
  }
];

const theatres = [
  {
    name: 'PVR Cinemas',
    location: {
      address: 'Mall Road, Central Plaza',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      coordinates: {
        latitude: 19.0760,
        longitude: 72.8777
      }
    },
    contact: {
      phone: '+91 22 12345678',
      email: 'pvr.mumbai@example.com'
    },
    screens: [
      {
        screenNumber: 1,
        name: 'Audi 1',
        capacity: 96,
        seatLayout: {
          rows: 8,
          seatsPerRow: 12,
          categories: [
            { name: 'Premium', rows: ['A', 'B', 'C'], basePrice: 150 },
            { name: 'Gold', rows: ['D', 'E', 'F'], basePrice: 200 },
            { name: 'Platinum', rows: ['G', 'H'], basePrice: 250 }
          ]
        },
        amenities: ['Dolby Atmos', '4K Projection']
      }
    ],
    amenities: ['Parking', 'Food Court', 'Wheelchair Access'],
    isActive: true
  },
  {
    name: 'INOX',
    location: {
      address: 'City Center Mall',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400002'
    },
    contact: {
      phone: '+91 22 87654321',
      email: 'inox.mumbai@example.com'
    },
    screens: [
      {
        screenNumber: 1,
        name: 'Screen 1',
        capacity: 96,
        seatLayout: {
          rows: 8,
          seatsPerRow: 12,
          categories: [
            { name: 'Premium', rows: ['A', 'B', 'C'], basePrice: 150 },
            { name: 'Gold', rows: ['D', 'E', 'F'], basePrice: 200 },
            { name: 'Platinum', rows: ['G', 'H'], basePrice: 250 }
          ]
        },
        amenities: ['IMAX']
      }
    ],
    amenities: ['Parking', 'Food Court'],
    isActive: true
  },
  {
    name: 'Cinepolis',
    location: {
      address: 'Downtown Plaza',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400003'
    },
    contact: {
      phone: '+91 22 11223344',
      email: 'cinepolis.mumbai@example.com'
    },
    screens: [
      {
        screenNumber: 1,
        name: 'Luxury Screen',
        capacity: 96,
        seatLayout: {
          rows: 8,
          seatsPerRow: 12,
          categories: [
            { name: 'Premium', rows: ['A', 'B', 'C'], basePrice: 150 },
            { name: 'Gold', rows: ['D', 'E', 'F'], basePrice: 200 },
            { name: 'Platinum', rows: ['G', 'H'], basePrice: 250 }
          ]
        },
        amenities: ['Recliner Seats', '4DX']
      }
    ],
    amenities: ['Parking', 'Restaurant', 'Gaming Zone'],
    isActive: true
  }
];

// Backend only stores TMDB IDs and booking availability
// Frontend fetches full movie details from TMDB API
const movies = [
  {
    tmdbId: 634649, // Spider-Man: No Way Home
    title: 'Spider-Man: No Way Home',
    overview: 'Available in theatres and online',
    availableIn: 'both',
    theatreRelease: {
      isReleased: true,
      releaseStatus: 'now_showing'
    },
    streamingDetails: {
      price: { rent: 199, buy: 499 }
    },
    popularity: 500,
    isActive: true
  },
  {
    tmdbId: 414906, // The Batman
    title: 'The Batman',
    overview: 'Available in theatres and online',
    availableIn: 'both',
    theatreRelease: {
      isReleased: true,
      releaseStatus: 'now_showing'
    },
    streamingDetails: {
      price: { rent: 199, buy: 499 }
    },
    popularity: 450,
    isActive: true
  },
  {
    tmdbId: 438631, // Dune
    title: 'Dune',
    overview: 'Available online',
    availableIn: 'online',
    streamingDetails: {
      price: { rent: 149, buy: 399 }
    },
    popularity: 400,
    isActive: true
  },
  {
    tmdbId: 27205, // Inception
    title: 'Inception',
    overview: 'Available online',
    availableIn: 'online',
    streamingDetails: {
      price: { rent: 99, buy: 299 }
    },
    popularity: 600,
    isActive: true
  },
  {
    tmdbId: 76600, // Avatar: The Way of Water
    title: 'Avatar: The Way of Water',
    overview: 'Coming soon to theatres',
    availableIn: 'theatre',
    theatreRelease: {
      isReleased: false,
      releaseStatus: 'coming_soon'
    },
    popularity: 700,
    isActive: true
  },
  {
    tmdbId: 299534, // Avengers: Endgame
    title: 'Avengers: Endgame',
    overview: 'Available in theatres',
    availableIn: 'theatre',
    theatreRelease: {
      isReleased: true,
      releaseStatus: 'now_showing'
    },
    popularity: 650,
    isActive: true
  }
];

// Seed database
const seedDatabase = async () => {
  try {
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Movie.deleteMany({});
    await Theatre.deleteMany({});
    await Showtime.deleteMany({});

    console.log('👤 Creating users...');
    const createdUsers = await User.create(users);
    console.log(`✅ Created ${createdUsers.length} users`);

    console.log('🏛️  Creating theatres...');
    const createdTheatres = await Theatre.create(theatres);
    console.log(`✅ Created ${createdTheatres.length} theatres`);

    console.log('🎬 Creating movies...');
    const createdMovies = await Movie.create(movies);
    console.log(`✅ Created ${createdMovies.length} movies`);

    // Create showtimes for theatre movies
    console.log('🎟️  Creating showtimes...');
    const showtimes = [];
    const theatreMovies = createdMovies.filter(m => 
      m.availableIn === 'theatre' || m.availableIn === 'both'
    );

    for (const theatre of createdTheatres) {
      for (const movie of theatreMovies.slice(0, 2)) { // First 2 movies per theatre
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        // Create showtimes for today and tomorrow
        for (const date of [today, tomorrow]) {
          for (const time of ['10:00', '13:00', '16:00', '19:00', '22:00']) {
            showtimes.push({
              movie: movie._id,
              theatre: theatre._id,
              screen: {
                screenNumber: 1,
                name: theatre.screens[0].name
              },
              date,
              startTime: time,
              pricing: theatre.screens[0].seatLayout.categories.map(cat => ({
                category: cat.name,
                price: cat.basePrice,
                dynamicPricing: {
                  enabled: true,
                  peakHours: {
                    enabled: true,
                    multiplier: 1.2
                  },
                  weekendMultiplier: 1.15
                }
              })),
              seats: {
                total: 96,
                available: 96,
                booked: []
              },
              language: movie.language,
              format: '2D',
              isActive: true
            });
          }
        }
      }
    }

    const createdShowtimes = await Showtime.create(showtimes);
    console.log(`✅ Created ${createdShowtimes.length} showtimes`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📊 Summary:');
    console.log(`Users: ${createdUsers.length}`);
    console.log(`Theatres: ${createdTheatres.length}`);
    console.log(`Movies: ${createdMovies.length}`);
    console.log(`Showtimes: ${createdShowtimes.length}`);
    console.log('\n👤 Admin Credentials:');
    console.log(`Email: ${process.env.ADMIN_EMAIL || 'admin@moviebooking.com'}`);
    console.log(`Password: ${process.env.ADMIN_PASSWORD || 'Admin@123'}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run seeder
seedDatabase();

