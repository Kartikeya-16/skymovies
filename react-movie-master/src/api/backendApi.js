import axios from 'axios';

// Backend API base URL
const API_URL = 'http://localhost:5001/api';

// Create axios instance for backend
const backendClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
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
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Optionally redirect to login
      // window.location.href = '/login';
    }
    return Promise.reject(error);
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

