import React, { useState } from "react";
import PageHeader from "../components/page-header/PageHeader";
import "./my-library.scss";

const MyLibrary = () => {
  // Mock data - will be fetched from backend later
  const [movies] = useState([
    {
      id: 1,
      title: "Inception",
      purchaseDate: "2025-10-15",
      duration: "148 min",
      rating: 8.8,
      poster: "https://via.placeholder.com/300x450?text=Inception",
    },
    {
      id: 2,
      title: "The Dark Knight",
      purchaseDate: "2025-09-22",
      duration: "152 min",
      rating: 9.0,
      poster: "https://via.placeholder.com/300x450?text=The+Dark+Knight",
    },
    {
      id: 3,
      title: "Interstellar",
      purchaseDate: "2025-08-10",
      duration: "169 min",
      rating: 8.7,
      poster: "https://via.placeholder.com/300x450?text=Interstellar",
    },
  ]);

  const [watchlist] = useState([
    {
      id: 4,
      title: "Dune",
      addedDate: "2025-11-01",
      duration: "155 min",
      rating: 8.0,
      poster: "https://via.placeholder.com/300x450?text=Dune",
    },
    {
      id: 5,
      title: "Tenet",
      addedDate: "2025-10-28",
      duration: "150 min",
      rating: 7.3,
      poster: "https://via.placeholder.com/300x450?text=Tenet",
    },
  ]);

  const [activeTab, setActiveTab] = useState("purchased");

  const displayMovies = activeTab === "purchased" ? movies : watchlist;

  return (
    <>
      <PageHeader>My Library</PageHeader>

      <div className="container">
        <div className="my-library-page">
          <div className="library-tabs">
            <button
              className={`tab-btn ${activeTab === "purchased" ? "active" : ""}`}
              onClick={() => setActiveTab("purchased")}
            >
              <i className="bx bx-purchase-tag"></i>
              Purchased Movies
            </button>
            <button
              className={`tab-btn ${activeTab === "watchlist" ? "active" : ""}`}
              onClick={() => setActiveTab("watchlist")}
            >
              <i className="bx bx-heart"></i>
              Watchlist
            </button>
          </div>

          <div className="movies-grid">
            {displayMovies.length === 0 ? (
              <div className="no-movies">
                <i className="bx bx-movie-play"></i>
                <h3>No movies found</h3>
                <p>
                  {activeTab === "purchased"
                    ? "Purchase movies to watch them anytime"
                    : "Add movies to your watchlist"}
                </p>
              </div>
            ) : (
              displayMovies.map((movie) => (
                <div key={movie.id} className="movie-card">
                  <div className="movie-poster">
                    <img src={movie.poster} alt={movie.title} />
                    <div className="overlay">
                      {activeTab === "purchased" ? (
                        <button className="play-btn">
                          <i className="bx bx-play"></i>
                          Watch Now
                        </button>
                      ) : (
                        <button className="remove-btn">
                          <i className="bx bx-x"></i>
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="movie-info">
                    <h3 className="movie-title">{movie.title}</h3>
                    <div className="movie-meta">
                      <span className="rating">
                        <i className="bx bx-star"></i>
                        {movie.rating}
                      </span>
                      <span className="duration">{movie.duration}</span>
                    </div>
                    <div className="movie-date">
                      {activeTab === "purchased"
                        ? `Purchased: ${movie.purchaseDate}`
                        : `Added: ${movie.addedDate}`}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MyLibrary;

