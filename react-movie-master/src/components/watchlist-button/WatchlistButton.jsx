import React, { useState, useEffect } from "react";
import "./watchlist-button.scss";

const WatchlistButton = ({ movieId, movieTitle, posterPath }) => {
  const [isInWatchlist, setIsInWatchlist] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    // Check if movie is in watchlist
    const watchlist = JSON.parse(localStorage.getItem("movieWatchlist") || "[]");
    const exists = watchlist.some(item => item.id === movieId);
    setIsInWatchlist(exists);
  }, [movieId]);

  const toggleWatchlist = () => {
    const watchlist = JSON.parse(localStorage.getItem("movieWatchlist") || "[]");
    
    if (isInWatchlist) {
      // Remove from watchlist
      const updated = watchlist.filter(item => item.id !== movieId);
      localStorage.setItem("movieWatchlist", JSON.stringify(updated));
      setIsInWatchlist(false);
      showToastMessage("Removed from watchlist");
    } else {
      // Add to watchlist
      const newItem = {
        id: movieId,
        title: movieTitle,
        posterPath: posterPath,
        addedAt: new Date().toISOString()
      };
      watchlist.push(newItem);
      localStorage.setItem("movieWatchlist", JSON.stringify(watchlist));
      setIsInWatchlist(true);
      showToastMessage("Added to watchlist");
    }
  };

  const showToastMessage = (message) => {
    setShowToast(message);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <>
      <button 
        className={`watchlist-btn ${isInWatchlist ? 'active' : ''}`}
        onClick={toggleWatchlist}
        aria-label={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
      >
        <i className={`bx ${isInWatchlist ? 'bxs-bookmark' : 'bx-bookmark'}`}></i>
        <span>{isInWatchlist ? "In Watchlist" : "Add to Watchlist"}</span>
      </button>
      
      {showToast && (
        <div className="watchlist-toast">
          <i className="bx bx-check-circle"></i>
          {showToast}
        </div>
      )}
    </>
  );
};

export default WatchlistButton;

