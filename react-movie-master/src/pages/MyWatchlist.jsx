import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../components/page-header/PageHeader";
import apiConfig from "../api/apiConfig";
import "./my-watchlist.scss";
import * as Config from "../constants/Config";

const MyWatchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [sortBy, setSortBy] = useState("recent"); // recent, title

  useEffect(() => {
    loadWatchlist();
  }, []);

  const loadWatchlist = () => {
    const stored = JSON.parse(localStorage.getItem("movieWatchlist") || "[]");
    setWatchlist(stored);
  };

  const removeFromWatchlist = (movieId) => {
    const updated = watchlist.filter(item => item.id !== movieId);
    localStorage.setItem("movieWatchlist", JSON.stringify(updated));
    setWatchlist(updated);
  };

  const clearAll = () => {
    if (window.confirm("Are you sure you want to clear your entire watchlist?")) {
      localStorage.setItem("movieWatchlist", JSON.stringify([]));
      setWatchlist([]);
    }
  };

  const getSortedWatchlist = () => {
    const sorted = [...watchlist];
    if (sortBy === "title") {
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    }
    return sorted.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt));
  };

  const sortedWatchlist = getSortedWatchlist();

  return (
    <>
      <PageHeader>My Watchlist</PageHeader>

      <div className="container">
        <div className="watchlist-page">
          {watchlist.length === 0 ? (
            <div className="empty-state">
              <i className="bx bx-bookmark"></i>
              <h2>Your watchlist is empty</h2>
              <p>Start adding movies you want to watch later!</p>
              <Link to={`/${Config.HOME_PAGE}`} className="btn">
                Browse Movies
              </Link>
            </div>
          ) : (
            <>
              <div className="watchlist-header">
                <div className="watchlist-info">
                  <h2>{watchlist.length} {watchlist.length === 1 ? 'Movie' : 'Movies'} in Watchlist</h2>
                  <p>Save movies you want to watch or book later</p>
                </div>
                <div className="watchlist-actions">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="sort-select"
                  >
                    <option value="recent">Recently Added</option>
                    <option value="title">Title (A-Z)</option>
                  </select>
                  <button onClick={clearAll} className="clear-btn">
                    <i className="bx bx-trash"></i>
                    Clear All
                  </button>
                </div>
              </div>

              <div className="watchlist-grid">
                {sortedWatchlist.map((movie) => (
                  <div key={movie.id} className="watchlist-card">
                    <Link
                      to={`/${Config.HOME_PAGE}/movie/${movie.id}`}
                      className="watchlist-card__poster"
                    >
                      <img
                        src={apiConfig.w500Image(movie.posterPath)}
                        alt={movie.title}
                        loading="lazy"
                      />
                      <div className="watchlist-card__overlay">
                        <i className="bx bx-play-circle"></i>
                        <span>View Details</span>
                      </div>
                    </Link>
                    <div className="watchlist-card__info">
                      <Link
                        to={`/${Config.HOME_PAGE}/movie/${movie.id}`}
                        className="watchlist-card__title"
                      >
                        {movie.title}
                      </Link>
                      <p className="watchlist-card__date">
                        Added {new Date(movie.addedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                      <button
                        onClick={() => removeFromWatchlist(movie.id)}
                        className="watchlist-card__remove"
                      >
                        <i className="bx bx-x"></i>
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default MyWatchlist;

