const axios = require('axios');

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';

const tmdbClient = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY
  }
});

/**
 * Get movie details from TMDB
 * @param {number} movieId - TMDB movie ID
 * @returns {Promise<Object>} Movie details
 */
exports.getMovieDetails = async (movieId) => {
  try {
    const response = await tmdbClient.get(`/movie/${movieId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching movie details from TMDB:', error.message);
    throw new Error('Failed to fetch movie details');
  }
};

/**
 * Get movie credits (cast & crew)
 * @param {number} movieId - TMDB movie ID
 * @returns {Promise<Object>} Movie credits
 */
exports.getMovieCredits = async (movieId) => {
  try {
    const response = await tmdbClient.get(`/movie/${movieId}/credits`);
    return response.data;
  } catch (error) {
    console.error('Error fetching movie credits from TMDB:', error.message);
    throw new Error('Failed to fetch movie credits');
  }
};

/**
 * Get movie videos (trailers, teasers)
 * @param {number} movieId - TMDB movie ID
 * @returns {Promise<Object>} Movie videos
 */
exports.getMovieVideos = async (movieId) => {
  try {
    const response = await tmdbClient.get(`/movie/${movieId}/videos`);
    return response.data;
  } catch (error) {
    console.error('Error fetching movie videos from TMDB:', error.message);
    throw new Error('Failed to fetch movie videos');
  }
};

/**
 * Search movies on TMDB
 * @param {string} query - Search query
 * @param {number} page - Page number
 * @returns {Promise<Object>} Search results
 */
exports.searchMovies = async (query, page = 1) => {
  try {
    const response = await tmdbClient.get('/search/movie', {
      params: { query, page }
    });
    return response.data;
  } catch (error) {
    console.error('Error searching movies on TMDB:', error.message);
    throw new Error('Failed to search movies');
  }
};

/**
 * Get popular movies from TMDB
 * @param {number} page - Page number
 * @returns {Promise<Object>} Popular movies
 */
exports.getPopularMovies = async (page = 1) => {
  try {
    const response = await tmdbClient.get('/movie/popular', {
      params: { page }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching popular movies from TMDB:', error.message);
    throw new Error('Failed to fetch popular movies');
  }
};

/**
 * Get now playing movies from TMDB
 * @param {number} page - Page number
 * @returns {Promise<Object>} Now playing movies
 */
exports.getNowPlayingMovies = async (page = 1) => {
  try {
    const response = await tmdbClient.get('/movie/now_playing', {
      params: { page }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching now playing movies from TMDB:', error.message);
    throw new Error('Failed to fetch now playing movies');
  }
};

/**
 * Get upcoming movies from TMDB
 * @param {number} page - Page number
 * @returns {Promise<Object>} Upcoming movies
 */
exports.getUpcomingMovies = async (page = 1) => {
  try {
    const response = await tmdbClient.get('/movie/upcoming', {
      params: { page }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching upcoming movies from TMDB:', error.message);
    throw new Error('Failed to fetch upcoming movies');
  }
};

/**
 * Get top rated movies from TMDB
 * @param {number} page - Page number
 * @returns {Promise<Object>} Top rated movies
 */
exports.getTopRatedMovies = async (page = 1) => {
  try {
    const response = await tmdbClient.get('/movie/top_rated', {
      params: { page }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching top rated movies from TMDB:', error.message);
    throw new Error('Failed to fetch top rated movies');
  }
};

/**
 * Get similar movies from TMDB
 * @param {number} movieId - TMDB movie ID
 * @param {number} page - Page number
 * @returns {Promise<Object>} Similar movies
 */
exports.getSimilarMovies = async (movieId, page = 1) => {
  try {
    const response = await tmdbClient.get(`/movie/${movieId}/similar`, {
      params: { page }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching similar movies from TMDB:', error.message);
    throw new Error('Failed to fetch similar movies');
  }
};

/**
 * Get movie recommendations from TMDB
 * @param {number} movieId - TMDB movie ID
 * @param {number} page - Page number
 * @returns {Promise<Object>} Recommended movies
 */
exports.getRecommendations = async (movieId, page = 1) => {
  try {
    const response = await tmdbClient.get(`/movie/${movieId}/recommendations`, {
      params: { page }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching recommendations from TMDB:', error.message);
    throw new Error('Failed to fetch recommendations');
  }
};

/**
 * Get genres list from TMDB
 * @returns {Promise<Object>} Genres list
 */
exports.getGenres = async () => {
  try {
    const response = await tmdbClient.get('/genre/movie/list');
    return response.data;
  } catch (error) {
    console.error('Error fetching genres from TMDB:', error.message);
    throw new Error('Failed to fetch genres');
  }
};

