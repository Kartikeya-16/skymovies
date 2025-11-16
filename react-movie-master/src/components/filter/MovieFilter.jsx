import React, { useState } from "react";
import "./movie-filter.scss";

const MovieFilter = ({ onFilterChange, showLanguageFilter = true }) => {
  const [filters, setFilters] = useState({
    genre: "all",
    language: "all",
    rating: "all",
    sortBy: "popularity",
  });

  const genres = [
    { value: "all", label: "All Genres" },
    { value: "28", label: "Action" },
    { value: "12", label: "Adventure" },
    { value: "16", label: "Animation" },
    { value: "35", label: "Comedy" },
    { value: "80", label: "Crime" },
    { value: "99", label: "Documentary" },
    { value: "18", label: "Drama" },
    { value: "10751", label: "Family" },
    { value: "14", label: "Fantasy" },
    { value: "36", label: "History" },
    { value: "27", label: "Horror" },
    { value: "10402", label: "Music" },
    { value: "9648", label: "Mystery" },
    { value: "10749", label: "Romance" },
    { value: "878", label: "Science Fiction" },
    { value: "53", label: "Thriller" },
    { value: "10752", label: "War" },
  ];

  const languages = [
    { value: "all", label: "All Languages" },
    { value: "en", label: "English" },
    { value: "hi", label: "Hindi" },
    { value: "te", label: "Telugu" },
    { value: "ta", label: "Tamil" },
    { value: "ml", label: "Malayalam" },
    { value: "kn", label: "Kannada" },
    { value: "es", label: "Spanish" },
    { value: "fr", label: "French" },
    { value: "ja", label: "Japanese" },
    { value: "ko", label: "Korean" },
  ];

  const ratings = [
    { value: "all", label: "All Ratings" },
    { value: "9", label: "9+ Rating" },
    { value: "8", label: "8+ Rating" },
    { value: "7", label: "7+ Rating" },
    { value: "6", label: "6+ Rating" },
  ];

  const sortOptions = [
    { value: "popularity", label: "Most Popular" },
    { value: "release_date", label: "Release Date" },
    { value: "rating", label: "Highest Rated" },
    { value: "title", label: "Title (A-Z)" },
  ];

  const handleFilterChange = (filterType, value) => {
    const newFilters = {
      ...filters,
      [filterType]: value,
    };
    setFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  const resetFilters = () => {
    const defaultFilters = {
      genre: "all",
      language: "all",
      rating: "all",
      sortBy: "popularity",
    };
    setFilters(defaultFilters);
    if (onFilterChange) {
      onFilterChange(defaultFilters);
    }
  };

  return (
    <div className="movie-filter">
      <div className="filter-header">
        <h3>
          <i className="bx bx-filter-alt"></i>
          Filters
        </h3>
        <button className="reset-btn" onClick={resetFilters}>
          <i className="bx bx-reset"></i>
          Reset
        </button>
      </div>

      <div className="filter-content">
        <div className="filter-group">
          <label>Genre</label>
          <select
            value={filters.genre}
            onChange={(e) => handleFilterChange("genre", e.target.value)}
          >
            {genres.map((genre) => (
              <option key={genre.value} value={genre.value}>
                {genre.label}
              </option>
            ))}
          </select>
        </div>

        {showLanguageFilter && (
          <div className="filter-group">
            <label>Language</label>
            <select
              value={filters.language}
              onChange={(e) => handleFilterChange("language", e.target.value)}
            >
              {languages.map((lang) => (
                <option key={lang.value} value={lang.value}>
                  {lang.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="filter-group">
          <label>Rating</label>
          <select
            value={filters.rating}
            onChange={(e) => handleFilterChange("rating", e.target.value)}
          >
            {ratings.map((rating) => (
              <option key={rating.value} value={rating.value}>
                {rating.label}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Sort By</label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange("sortBy", e.target.value)}
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default MovieFilter;

