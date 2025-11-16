import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import "./movie-grid-list.scss";
import MovieCard from "../movie-card/MovieCard";
import tmdbApi, { category } from "../../api/tmdbApi";

const MovieGridList = (props) => {
  const [items, setItems] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMorePages, setHasMorePages] = useState(true);

  // Function to fetch and filter movies from API
  const fetchMoviesFromAPI = useCallback(async (page = 1) => {
    let response = null;
    const params = { page };

    if (props.type !== "similar") {
      switch (props.category) {
        case category.movie:
          response = await tmdbApi.getMoviesList(props.type, { params });
          break;
        default:
          response = await tmdbApi.getTvList(props.type, { params });
      }
    } else {
      response = await tmdbApi.similar(props.category, props.id);
    }

    let results = response.results || [];
    const totalPagesFromAPI = response.total_pages || 1;

    // Apply release date filter
    if (props.filterByReleaseDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      results = results.filter((item) => {
        if (!item.release_date) return false;
        const releaseDate = new Date(item.release_date);
        releaseDate.setHours(0, 0, 0, 0);

        if (props.filterByReleaseDate === "past") {
          return releaseDate <= today;
        } else if (props.filterByReleaseDate === "future") {
          return releaseDate > today;
        }
        return true;
      });
    }

    // Apply user filters
    if (props.filters) {
      // Filter by genre
      if (props.filters.genre && props.filters.genre !== "all") {
        const genreId = parseInt(props.filters.genre);
        results = results.filter(
          (item) => item.genre_ids && item.genre_ids.includes(genreId)
        );
      }

      // Filter by language
      if (props.filters.language && props.filters.language !== "all") {
        results = results.filter(
          (item) => item.original_language === props.filters.language
        );
      }

      // Filter by rating
      if (props.filters.rating && props.filters.rating !== "all") {
        const minRating = parseFloat(props.filters.rating);
        results = results.filter((item) => item.vote_average >= minRating);
      }

      // Sort by
      if (props.filters.sortBy) {
        results = [...results].sort((a, b) => {
          switch (props.filters.sortBy) {
            case "popularity":
              return (b.popularity || 0) - (a.popularity || 0);
            case "release_date":
              return (
                new Date(b.release_date || 0) - new Date(a.release_date || 0)
              );
            case "rating":
              return (b.vote_average || 0) - (a.vote_average || 0);
            case "title":
              return (a.title || a.name || "").localeCompare(
                b.title || b.name || ""
              );
            default:
              return 0;
          }
        });
      }
    }

    return { results, totalPages: totalPagesFromAPI };
  }, [props.category, props.id, props.type, props.filterByReleaseDate, props.filters]);

  useEffect(() => {
    const getInitialMovies = async () => {
      try {
        setLoading(true);
        setHasMorePages(true);

        // Set movie limits: Coming Soon = 30, Now Playing = 40
        const movieLimit = props.filterByReleaseDate === "future" ? 30 : 40;
        
        // Fetch enough pages to get the required number of movies
        // Each page has ~20 movies, so we need 2 pages for 40 movies and 2 pages for 30 movies
        const pagesNeeded = Math.ceil(movieLimit / 20);
        const pagesToFetch = Array.from({ length: pagesNeeded }, (_, i) => i + 1);
        const allResults = [];
        let maxPages = 1;

        for (const page of pagesToFetch) {
          const { results, totalPages } = await fetchMoviesFromAPI(page);
          allResults.push(...results);
          maxPages = Math.max(maxPages, totalPages);
          
          // If we've reached the last page, stop
          if (page >= totalPages) {
            setHasMorePages(false);
            break;
          }
          
          // If we have enough movies, stop fetching
          if (allResults.length >= movieLimit) {
            break;
          }
        }

        // Limit the results to the exact number specified
        const limitedResults = allResults.slice(0, movieLimit);
        
        setItems(limitedResults);
        setCurrentPage(pagesNeeded);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching movies:", error);
        setLoading(false);
      }
    };

    getInitialMovies();
  }, [fetchMoviesFromAPI]);

  const handleLoadMore = async () => {
    if (loadingMore || !hasMorePages) return;

    // Get the movie limit
    const movieLimit = props.filterByReleaseDate === "future" ? 30 : 40;
    
    // Don't load more if we've reached the limit
    if (items.length >= movieLimit) {
      setHasMorePages(false);
      return;
    }

    setLoadingMore(true);
    const nextPage = currentPage + 1;

    try {
      // Fetch next page from API
      const { results, totalPages } = await fetchMoviesFromAPI(nextPage);

      if (results.length > 0) {
        const newItems = [...items, ...results];
        const limitedItems = newItems.slice(0, movieLimit);
        
        setItems(limitedItems);
        setCurrentPage(nextPage);
        
        // Check if we've reached the limit or the last page
        if (limitedItems.length >= movieLimit || nextPage >= totalPages) {
          setHasMorePages(false);
        }
      } else {
        setHasMorePages(false);
      }
    } catch (error) {
      console.error("Error loading more movies:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  // Get the movie limit
  const movieLimit = props.filterByReleaseDate === "future" ? 30 : 40;
  const hasMore = hasMorePages && items.length < movieLimit;

  if (loading) {
    return (
      <div className="movie-grid-list loading">
        <div className="loading-spinner">
          <i className="bx bx-loader-alt"></i>
          <p>Loading movies...</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="movie-grid-list empty">
        <p>No movies found. Try adjusting your filters.</p>
      </div>
    );
  }

  return (
    <div className="movie-grid-list">
      <div className="movie-grid-list__grid">
        {items.map((item, index) => (
          <MovieCard key={`${item.id}-${index}`} item={item} category={props.category} />
        ))}
      </div>

      {hasMore && (
        <div className="movie-grid-list__load-more">
          <button
            onClick={handleLoadMore}
            className="load-more-btn"
            disabled={loadingMore}
          >
            {loadingMore ? (
              <>
                <i className="bx bx-loader-alt"></i>
                Loading...
              </>
            ) : (
              <>
                Load More Movies
                <i className="bx bx-chevron-down"></i>
              </>
            )}
          </button>
          <p className="load-more-info">
            Showing {items.length} out of {props.filterByReleaseDate === "future" ? 30 : 40} movies
          </p>
        </div>
      )}
    </div>
  );
};

MovieGridList.propTypes = {
  category: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default MovieGridList;

