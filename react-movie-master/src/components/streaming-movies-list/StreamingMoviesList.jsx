import React, { useState, useEffect } from "react";
import tmdbApi, { category, movieType } from "../../api/tmdbApi";
import MovieWithOTT from "../movie-with-ott/MovieWithOTT";
import "./streaming-movies-list.scss";

const StreamingMoviesList = ({ type = movieType.popular, title = "Streaming Movies" }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMovies = async () => {
      try {
        setLoading(true);
        const response = await tmdbApi.getMoviesList(type, { params: { page: 1 } });
        
        // Filter movies that are NOT in theatres (older than 45 days)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const streamingMovies = response.results.filter(movie => {
          if (!movie.release_date) return false;
          
          const releaseDate = new Date(movie.release_date);
          releaseDate.setHours(0, 0, 0, 0);
          
          const daysSinceRelease = Math.floor((today - releaseDate) / (1000 * 60 * 60 * 24));
          
          // Only show movies that are older than 45 days (not in theatres anymore)
          return daysSinceRelease > 45;
        });
        
        setMovies(streamingMovies.slice(0, 20)); // Limit to 20 movies
        setLoading(false);
      } catch (error) {
        console.error("Error fetching streaming movies:", error);
        setLoading(false);
      }
    };

    getMovies();
  }, [type]);

  if (loading) {
    return (
      <div className="streaming-movies-list loading">
        <div className="loading-spinner">
          <i className="bx bx-loader-alt"></i>
          <p>Loading movies...</p>
        </div>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="streaming-movies-list empty">
        <p>No streaming movies available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="streaming-movies-list">
      <div className="streaming-movies-grid">
        {movies.map((movie) => (
          <MovieWithOTT key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default StreamingMoviesList;

