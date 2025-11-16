import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import tmdbApi from "../../api/tmdbApi";
import { category } from "../../api/tmdbApi";
import * as Config from "../../constants/Config";
import "./movie-search.scss";

const MovieSearch = ({ placeholder = "Search movies...", autoFocus = false }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const searchMovies = async () => {
      if (searchQuery.length > 2) {
        setIsLoading(true);
        try {
          const response = await tmdbApi.search(category.movie, {
            params: { query: searchQuery }
          });
          setSuggestions(response.results.slice(0, 5)); // Top 5 results
          setShowSuggestions(true);
        } catch (error) {
          console.error('Search error:', error);
          setSuggestions([]);
        }
        setIsLoading(false);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const debounceTimer = setTimeout(searchMovies, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (movie) => {
    navigate(`/${Config.HOME_PAGE}/movie/${movie.id}`);
    setSearchQuery("");
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setShowSuggestions(false);
  };

  return (
    <div className="movie-search" ref={searchRef}>
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-wrapper">
          <i className="bx bx-search search-icon"></i>
          <input
            type="text"
            className="search-input"
            placeholder={placeholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus={autoFocus}
          />
          {searchQuery && (
            <button
              type="button"
              className="clear-btn"
              onClick={clearSearch}
              aria-label="Clear search"
            >
              <i className="bx bx-x"></i>
            </button>
          )}
        </div>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="search-suggestions">
          <div className="suggestions-list">
            {suggestions.map((movie) => (
              <div
                key={movie.id}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(movie)}
              >
                <i className="bx bx-movie"></i>
                <div className="suggestion-info">
                  <span className="suggestion-title">{movie.title || movie.name}</span>
                  <span className="suggestion-meta">
                    {movie.release_date?.substring(0, 4) || movie.first_air_date?.substring(0, 4) || 'N/A'} • Movie
                  </span>
                </div>
                <i className="bx bx-right-arrow-alt"></i>
              </div>
            ))}
          </div>
          <div className="suggestions-footer">
            <button
              type="button"
              className="view-all-btn"
              onClick={handleSearch}
            >
              View all results for "{searchQuery}"
              <i className="bx bx-right-arrow-alt"></i>
            </button>
          </div>
        </div>
      )}

      {showSuggestions && searchQuery.length > 2 && suggestions.length === 0 && !isLoading && (
        <div className="search-suggestions">
          <div className="no-results">
            <i className="bx bx-search-alt"></i>
            <p>No results found for "{searchQuery}"</p>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="search-suggestions">
          <div className="no-results">
            <p>Searching...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieSearch;

