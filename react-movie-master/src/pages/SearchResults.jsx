import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageHeader from "../components/page-header/PageHeader";
import MovieSearch from "../components/search/MovieSearch";
import MovieCard from "../components/movie-card/MovieCard";
import { category } from "../api/tmdbApi";
import "./search-results.scss";

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Mock results - will be replaced with real API calls
  const mockResults = [
    { id: 1, title: "Spider-Man: No Way Home", poster_path: null, vote_average: 8.5, release_date: "2021-12-15" },
    { id: 2, title: "The Batman", poster_path: null, vote_average: 8.0, release_date: "2022-03-01" },
    { id: 3, title: "Dune", poster_path: null, vote_average: 8.3, release_date: "2021-10-22" },
  ];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("q");
    
    if (query) {
      setSearchQuery(query);
      searchMovies(query);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const searchMovies = async (query) => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      // Filter mock results based on query
      const filtered = mockResults.filter((movie) =>
        movie.title.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setIsLoading(false);
    }, 500);
  };

  return (
    <>
      <PageHeader>Search Results</PageHeader>

      <div className="container">
        <div className="search-results-page">
          {/* Search Bar */}
          <div className="search-bar-section">
            <MovieSearch placeholder="Search for movies..." autoFocus />
          </div>

          {/* Results Info */}
          <div className="results-info">
            {searchQuery && (
              <>
                <h2>
                  Results for: <span className="query">"{searchQuery}"</span>
                </h2>
                <p className="result-count">
                  {isLoading ? "Searching..." : `${results.length} result${results.length !== 1 ? 's' : ''} found`}
                </p>
              </>
            )}
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Searching for movies...</p>
            </div>
          )}

          {/* Results Grid */}
          {!isLoading && results.length > 0 && (
            <div className="results-grid">
              {results.map((movie) => (
                <MovieCard key={movie.id} item={movie} category={category.movie} />
              ))}
            </div>
          )}

          {/* No Results */}
          {!isLoading && searchQuery && results.length === 0 && (
            <div className="no-results">
              <i className="bx bx-search-alt-2"></i>
              <h3>No results found</h3>
              <p>We couldn't find any movies matching "{searchQuery}"</p>
              <div className="suggestions">
                <p>Try searching for:</p>
                <div className="suggestion-chips">
                  <button onClick={() => navigate("/search?q=action")}>
                    Action Movies
                  </button>
                  <button onClick={() => navigate("/search?q=comedy")}>
                    Comedy
                  </button>
                  <button onClick={() => navigate("/search?q=thriller")}>
                    Thriller
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && !searchQuery && (
            <div className="empty-state">
              <i className="bx bx-movie"></i>
              <h3>Start searching for movies</h3>
              <p>Enter a movie name, actor, or genre to find what you're looking for</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchResults;

