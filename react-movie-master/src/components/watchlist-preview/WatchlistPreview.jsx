import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiConfig from "../../api/apiConfig";
import "./watchlist-preview.scss";
import * as Config from "../../constants/Config";

const WatchlistPreview = () => {
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    loadWatchlist();
  }, []);

  const loadWatchlist = () => {
    const stored = JSON.parse(localStorage.getItem("movieWatchlist") || "[]");
    // Show only first 6 movies
    setWatchlist(stored.slice(0, 6));
  };

  if (watchlist.length === 0) {
    return null; // Don't show section if watchlist is empty
  }

  return (
    <div className="watchlist-preview">
      <div className="section mb-3">
        <div className="section__header mb-2">
          <h2>My Watchlist</h2>
          <Link to="/my-watchlist">
            <button className="view-all-btn">
              View All <i className="bx bx-chevron-right"></i>
            </button>
          </Link>
        </div>
        <p className="section-subtitle" style={{ marginBottom: "2rem", color: "rgba(255, 255, 255, 0.6)" }}>
          {watchlist.length} {watchlist.length === 1 ? 'movie' : 'movies'} saved for later
        </p>
        <div className="watchlist-preview__grid">
          {watchlist.map((movie) => (
            <Link
              key={movie.id}
              to={`/${Config.HOME_PAGE}/movie/${movie.id}`}
              className="watchlist-preview__card"
            >
              <div className="watchlist-preview__poster">
                <img
                  src={apiConfig.w500Image(movie.posterPath)}
                  alt={movie.title}
                  loading="lazy"
                />
                <div className="watchlist-preview__overlay">
                  <i className="bx bx-play-circle"></i>
                </div>
              </div>
              <div className="watchlist-preview__title">
                {movie.title}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WatchlistPreview;

