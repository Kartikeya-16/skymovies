const express = require('express');
const {
  searchMovies,
  getSuggestions
} = require('../controllers/searchController');

const router = express.Router();

router.get('/movies', searchMovies);
router.get('/suggestions', getSuggestions);

module.exports = router;

