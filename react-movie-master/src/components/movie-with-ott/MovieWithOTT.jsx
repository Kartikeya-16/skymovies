import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import apiConfig from "../../api/apiConfig";
import "./movie-with-ott.scss";
import * as Config from "../../constants/Config";

const MovieWithOTT = ({ movie }) => {
  const [platforms, setPlatforms] = useState([]);

  useEffect(() => {
    // Generate OTT platforms for movies older than 45 days
    if (!movie.release_date) {
      setPlatforms([]);
      return;
    }

    const releaseDate = new Date(movie.release_date);
    const today = new Date();
    const daysSinceRelease = Math.floor((today - releaseDate) / (1000 * 60 * 60 * 24));

    if (daysSinceRelease > 45) {
      const allPlatforms = [
        { 
          name: "Netflix", 
          url: `https://www.netflix.com/search?q=${encodeURIComponent(movie.title || movie.name)}`,
          color: "#E50914"
        },
        { 
          name: "Prime Video", 
          url: `https://www.primevideo.com/search/ref=atv_nb_s?phrase=${encodeURIComponent(movie.title || movie.name)}`,
          color: "#00A8E1"
        },
        { 
          name: "Disney+", 
          url: `https://www.hotstar.com/in/search?q=${encodeURIComponent(movie.title || movie.name)}`,
          color: "#0F1014"
        },
        { 
          name: "Apple TV+", 
          url: `https://tv.apple.com/search?q=${encodeURIComponent(movie.title || movie.name)}`,
          color: "#000000"
        },
        { 
          name: "YouTube", 
          url: `https://www.youtube.com/results?search_query=${encodeURIComponent(movie.title || movie.name + " full movie")}`,
          color: "#FF0000"
        }
      ];

      // Show 2-3 random platforms
      const shuffled = allPlatforms.sort(() => 0.5 - Math.random());
      setPlatforms(shuffled.slice(0, Math.floor(Math.random() * 2) + 2));
    } else {
      setPlatforms([]);
    }
  }, [movie]);

  return (
    <div className="movie-with-ott">
      <Link 
        to={`/${Config.HOME_PAGE}/movie/${movie.id}`}
        className="movie-with-ott__poster"
      >
        <img
          src={apiConfig.w500Image(movie.poster_path)}
          alt={movie.title || movie.name}
          loading="lazy"
        />
        <div className="movie-with-ott__overlay">
          <i className="bx bx-play-circle"></i>
          <span>View Details</span>
        </div>
      </Link>
      
      <div className="movie-with-ott__info">
        <Link 
          to={`/${Config.HOME_PAGE}/movie/${movie.id}`}
          className="movie-with-ott__title"
        >
          {movie.title || movie.name}
        </Link>
        
        <div className="movie-with-ott__rating">
          <i className="bx bx-star"></i>
          <span>{movie.vote_average?.toFixed(1) || "N/A"}</span>
        </div>

        {platforms.length > 0 ? (
          <div className="movie-with-ott__platforms">
            <p className="platforms-label">Available on:</p>
            <div className="platforms-list">
              {platforms.map((platform, index) => (
                <a
                  key={index}
                  href={platform.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="platform-tag"
                  style={{ "--platform-color": platform.color }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {platform.name}
                </a>
              ))}
            </div>
          </div>
        ) : (
          <div className="movie-with-ott__platforms unavailable">
            <p className="platforms-label">Not yet on streaming</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieWithOTT;

