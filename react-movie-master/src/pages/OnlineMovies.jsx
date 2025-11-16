import React from "react";
import PageHeader from "../components/page-header/PageHeader";
import MovieSearch from "../components/search/MovieSearch";
import StreamingMoviesList from "../components/streaming-movies-list/StreamingMoviesList";
import { movieType } from "../api/tmdbApi";
import "./online-movies.scss";

const OnlineMovies = () => {
  return (
    <>
      <PageHeader>Streaming Movies</PageHeader>

      <div className="container">
        <div className="streaming-movies-intro">
          <div className="intro-content">
            <i className="bx bx-tv"></i>
            <h2>Movies Not in Theatres</h2>
            <p>
              These movies are no longer showing in theatres but may be available on streaming platforms. 
              Click on any platform tag to check availability.
            </p>
            <div className="intro-note">
              <i className="bx bx-info-circle"></i>
              <span>We don't stream movies directly. We help you find where to watch them online.</span>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="search-section">
          <MovieSearch placeholder="Search streaming movies..." />
        </div>

        <div className="section mb-3">
          <div className="section__header mb-2">
            <h2>Popular Streaming Movies</h2>
            <p className="section-subtitle">
              Most popular movies available on OTT platforms
            </p>
          </div>
          <StreamingMoviesList type={movieType.popular} />
        </div>

        <div className="section mb-3">
          <div className="section__header mb-2">
            <h2>Top Rated Streaming Movies</h2>
            <p className="section-subtitle">
              Highest rated movies you can watch online
            </p>
          </div>
          <StreamingMoviesList type={movieType.top_rated} />
        </div>
      </div>
    </>
  );
};

export default OnlineMovies;

