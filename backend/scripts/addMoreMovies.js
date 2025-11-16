const path = require('path');
const dotenv = require('dotenv');
const envPath = path.resolve(__dirname, '../.env');
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error('❌ Error loading .env file:', result.error);
  process.exit(1);
}

const mongoose = require('mongoose');
const Movie = require('../models/Movie');

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

// Popular movies to add (TMDB IDs)
const additionalMovies = [
  // Theatre Movies - Now Showing
  { tmdbId: 502356, title: 'The Super Mario Bros. Movie', availableIn: 'theatre', releaseStatus: 'now_showing' },
  { tmdbId: 447365, title: 'Guardians of the Galaxy Vol. 3', availableIn: 'theatre', releaseStatus: 'now_showing' },
  { tmdbId: 298618, title: 'The Flash', availableIn: 'theatre', releaseStatus: 'now_showing' },
  { tmdbId: 569094, title: 'Spider-Man: Across the Spider-Verse', availableIn: 'theatre', releaseStatus: 'now_showing' },
  { tmdbId: 385687, title: 'Fast X', availableIn: 'theatre', releaseStatus: 'now_showing' },
  
  // Theatre Movies - Coming Soon
  { tmdbId: 575264, title: 'Mission: Impossible - Dead Reckoning', availableIn: 'theatre', releaseStatus: 'coming_soon' },
  { tmdbId: 507089, title: 'Five Nights at Freddy\'s', availableIn: 'theatre', releaseStatus: 'coming_soon' },
  { tmdbId: 609681, title: 'The Marvels', availableIn: 'theatre', releaseStatus: 'coming_soon' },
  
  // Online Streaming
  { tmdbId: 615656, title: 'Meg 2: The Trench', availableIn: 'online', price: { rent: 149, buy: 399 } },
  { tmdbId: 346698, title: 'Barbie', availableIn: 'online', price: { rent: 199, buy: 499 } },
  { tmdbId: 872585, title: 'Oppenheimer', availableIn: 'online', price: { rent: 199, buy: 499 } },
  { tmdbId: 980489, title: 'Gran Turismo', availableIn: 'online', price: { rent: 149, buy: 399 } },
  
  // Both Theatre and Online
  { tmdbId: 945961, title: 'Alien: Romulus', availableIn: 'both', releaseStatus: 'now_showing', price: { rent: 199, buy: 499 } },
  { tmdbId: 718821, title: 'Twisters', availableIn: 'both', releaseStatus: 'now_showing', price: { rent: 199, buy: 499 } },
  { tmdbId: 533535, title: 'Deadpool & Wolverine', availableIn: 'both', releaseStatus: 'now_showing', price: { rent: 249, buy: 599 } },
];

async function addMovies() {
  try {
    console.log('📝 Adding movies to database...\n');

    for (const movieData of additionalMovies) {
      // Check if movie already exists
      const existing = await Movie.findOne({ tmdbId: movieData.tmdbId });
      
      if (existing) {
        console.log(`⏭️  Skipped: ${movieData.title} (already exists)`);
        continue;
      }

      // Create new movie
      const movie = new Movie({
        tmdbId: movieData.tmdbId,
        title: movieData.title,
        overview: `${movieData.title} - Available for ${movieData.availableIn}`,
        availableIn: movieData.availableIn,
        releaseStatus: movieData.releaseStatus || null,
        streamingDetails: movieData.price ? {
          price: movieData.price,
          quality: ['HD', '4K'],
          availableUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) // 90 days
        } : undefined,
        isActive: true
      });

      await movie.save();
      console.log(`✅ Added: ${movieData.title} (${movieData.availableIn})`);
    }

    console.log('\n🎉 Successfully added movies!');
    
    // Show summary
    const theatreCount = await Movie.countDocuments({ availableIn: { $in: ['theatre', 'both'] } });
    const onlineCount = await Movie.countDocuments({ availableIn: { $in: ['online', 'both'] } });
    const totalCount = await Movie.countDocuments();
    
    console.log('\n📊 Database Summary:');
    console.log(`Total Movies: ${totalCount}`);
    console.log(`Theatre Movies: ${theatreCount}`);
    console.log(`Online Movies: ${onlineCount}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding movies:', error);
    process.exit(1);
  }
}

// Wait for MongoDB connection
setTimeout(() => {
  addMovies();
}, 1000);

