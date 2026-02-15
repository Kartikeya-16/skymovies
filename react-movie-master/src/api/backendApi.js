import axios from 'axios';

// Backend API base URL - use environment variable
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance for backend
const backendClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 30000, // 30 second timeout
});

// Add token to requests if available
backendClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
backendClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network error
    if (!error.response) {
      console.error('Network Error:', error.message);
      return Promise.reject({
        message: 'Network error. Please check your internet connection.',
        type: 'network',
        originalError: error
      });
    }

    // Handle specific status codes
    const { status, data } = error.response;
    
    switch (status) {
      case 401:
        // Token expired or invalid
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        console.error('Authentication failed. Please login again.');
        // Optionally redirect to login
        if (window.location.pathname !== '/') {
          window.location.href = '/';
        }
        break;
        
      case 403:
        console.error('Access forbidden:', data?.message);
        break;
        
      case 404:
        console.error('Resource not found:', data?.message);
        break;
        
      case 429:
        console.error('Too many requests. Please try again later.');
        break;
        
      case 500:
      case 502:
      case 503:
        console.error('Server error. Please try again later.');
        break;
        
      default:
        console.error('API Error:', data?.message || error.message);
    }
    
    return Promise.reject({
      message: data?.message || 'An error occurred',
      status,
      errors: data?.errors,
      type: 'api',
      originalError: error
    });
  }
);

const backendApi = {
  // ============ AUTH ============
  auth: {
    register: (userData) => backendClient.post('/auth/register', userData),
    login: (credentials) => backendClient.post('/auth/login', credentials),
    getProfile: () => backendClient.get('/auth/me'),
    updateProfile: (data) => backendClient.put('/auth/profile', data),
    logout: () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  // ============ MOVIES ============
  movies: {
    // Get all movies
    getAll: (params) => backendClient.get('/movies', { params }),
    
    // Get theatre movies (returns tmdbIds + booking availability)
    getTheatreMovies: () => backendClient.get('/movies/theatre'),
    
    // Get online streaming movies (returns tmdbIds + streaming details)
    getOnlineMovies: () => backendClient.get('/movies/online'),
    
    // Check if a TMDB movie is bookable/streamable
    checkAvailability: (tmdbId) => backendClient.get(`/movies/tmdb/${tmdbId}`),
    
    // Get movie details by internal ID (for booking-specific data)
    getById: (id) => backendClient.get(`/movies/${id}`),
    
    // Get showtimes for a movie
    getShowtimes: (movieId, params) => backendClient.get(`/movies/${movieId}/showtimes`, { params }),
    
    // Get recommendations
    getRecommendations: (movieId) => backendClient.get(`/movies/${movieId}/recommendations`)
  },

  // ============ THEATRES ============
  theatres: {
    getAll: (params) => backendClient.get('/theatres', { params }),
    getById: (id) => backendClient.get(`/theatres/${id}`),
    getShowtimes: (theatreId, params) => backendClient.get(`/theatres/${theatreId}/showtimes`, { params }),
    getSeats: (showtimeId) => backendClient.get(`/theatres/showtimes/${showtimeId}/seats`)
  },

  // ============ BOOKINGS ============
  bookings: {
    // Create new booking
    create: (bookingData) => backendClient.post('/bookings', bookingData),
    
    // Get user's bookings
    getMyBookings: (params) => backendClient.get('/bookings', { params }),
    
    // Get specific booking
    getById: (id) => backendClient.get(`/bookings/${id}`),
    
    // Cancel booking
    cancel: (id) => backendClient.put(`/bookings/${id}/cancel`),
    
    // Verify booking (for entry at theatre)
    verify: (bookingId) => backendClient.post(`/bookings/${bookingId}/verify`)
  },

  // ============ PAYMENTS ============
  payments: {
    // Create Razorpay order (can accept bookingId OR direct amount + bookingDetails)
    createOrder: (data) => backendClient.post('/payments/create-order', data),
    
    // Verify Razorpay payment
    verifyPayment: (paymentData) => backendClient.post('/payments/verify', paymentData),
    
    // Get payment history
    getHistory: () => backendClient.get('/payments/history')
  },

  // ============ USER ============
  user: {
    // Get user profile
    getProfile: () => backendClient.get('/users/profile'),
    
    // Update profile
    updateProfile: (data) => backendClient.put('/users/profile', data),
    
    // Get watchlist
    getWatchlist: () => backendClient.get('/users/watchlist'),
    
    // Add to watchlist
    addToWatchlist: (tmdbId) => backendClient.post('/users/watchlist', { tmdbId }),
    
    // Remove from watchlist
    removeFromWatchlist: (tmdbId) => backendClient.delete(`/users/watchlist/${tmdbId}`),
    
    // Get library (purchased/rented movies)
    getLibrary: () => backendClient.get('/users/library'),
    
    // Get booking history
    getBookingHistory: () => backendClient.get('/users/bookings'),
    
    // Update watch progress
    updateWatchProgress: (movieId, progress) => 
      backendClient.put(`/users/watch-progress/${movieId}`, { progress }),
    
    // Get continue watching list
    getContinueWatching: () => backendClient.get('/users/continue-watching')
  },

  // ============ SEARCH ============
  search: {
    movies: (query, params) => backendClient.get('/search', { params: { q: query, ...params } }),
    suggestions: (query) => backendClient.get('/search/suggestions', { params: { q: query } })
  },

  // ============ STREAMING ============
  streaming: {
    // Get streaming URL (after payment verification)
    getStreamUrl: (movieId) => backendClient.get(`/streaming/${movieId}/url`),
    
    // Purchase movie
    purchase: (movieId, type) => backendClient.post(`/streaming/purchase`, { movieId, type }),
    
    // Verify streaming access
    verifyAccess: (movieId) => backendClient.get(`/streaming/${movieId}/verify`)
  }
};

export default backendApi;

// Helper to check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Helper to get current user
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Helper to save auth data
export const saveAuthData = (token, user) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

