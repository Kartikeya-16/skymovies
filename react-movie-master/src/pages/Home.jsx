import React from "react";
import { Link } from "react-router-dom";

import { OutlineButton } from "../components/button/Button";
import HeroSlide from "../components/hero-slide/HeroSlide";
import MovieList from "../components/movie-list/MovieList";
import StreamingMoviesList from "../components/streaming-movies-list/StreamingMoviesList";
import WatchlistPreview from "../components/watchlist-preview/WatchlistPreview";

import { category, movieType, tvType } from "../api/tmdbApi";

import * as Config from "./../constants/Config";

const Home = () => {
  return (
    <>
      <HeroSlide />

      <div className="container">
        {/* Watchlist Preview Section */}
        <WatchlistPreview />

        <div className="section mb-3">
          <div className="section__header mb-2">
            <h2>Now Showing in Theatres</h2>
            <Link to="/theatre-movies">
              <OutlineButton className="small">View all</OutlineButton>
            </Link>
          </div>
          <MovieList 
            category={category.movie} 
            type={movieType.now_playing} 
            filterByReleaseDate="past"
          />
        </div>

        <div className="section mb-3">
          <div className="section__header mb-2">
            <h2>Coming Soon</h2>
            <Link to="/theatre-movies">
              <OutlineButton className="small">View all</OutlineButton>
            </Link>
          </div>
          <MovieList 
            category={category.movie} 
            type={movieType.upcoming} 
            filterByReleaseDate="future"
          />
        </div>

        <div className="section mb-3">
          <div className="section__header mb-2">
            <h2>Streaming Movies</h2>
            <Link to="/online-movies">
              <OutlineButton className="small">View all</OutlineButton>
            </Link>
          </div>
          <p className="section-subtitle" style={{ marginBottom: "2rem", color: "rgba(255, 255, 255, 0.6)" }}>
            Movies not in theatres - available on OTT platforms
          </p>
          <StreamingMoviesList type={movieType.popular} />
        </div>

        <div className="section mb-3">
          <div className="section__header mb-2">
            <h2>Popular Movies</h2>
            <Link to={`/${Config.HOME_PAGE}/movie`}>
              <OutlineButton className="small">View all</OutlineButton>
            </Link>
          </div>
          <MovieList category={category.movie} type={movieType.popular} />
        </div>

        <div className="section mb-3">
          <div className="section__header mb-2">
            <h2>Trending Shows</h2>
            <Link to={`/${Config.HOME_PAGE}/tv`}>
              <OutlineButton className="small">View all</OutlineButton>
            </Link>
          </div>
          <MovieList category={category.tv} type={tvType.popular} />
        </div>
      </div>
    </>
  );
};

export default Home;
