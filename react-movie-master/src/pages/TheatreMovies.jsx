import React, { useState } from "react";
import MovieGridList from "../components/movie-grid-list/MovieGridList";
import PageHeader from "../components/page-header/PageHeader";
import MovieFilter from "../components/filter/MovieFilter";
import MovieSearch from "../components/search/MovieSearch";
import { category, movieType } from "../api/tmdbApi";

const TheatreMovies = () => {
  const [filters, setFilters] = useState({
    genre: "all",
    language: "all",
    rating: "all",
    sortBy: "popularity"
  });

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <>
      <PageHeader>Movies in Theatres</PageHeader>

      <div className="container">
        {/* Search Section */}
        <div className="search-section" style={{ marginBottom: "2rem", display: "flex", justifyContent: "center" }}>
          <MovieSearch placeholder="Search theatre movies..." />
        </div>

        {/* Filter Section */}
        <MovieFilter onFilterChange={handleFilterChange} />

        <div className="section mb-3">
          <div className="section__header mb-2">
            <h2>Now Playing in Theatres</h2>
            <p className="section-subtitle" style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "1rem" }}>
              {filters && filters.genre !== "all" ? `Filtered by genre` : "Currently showing in theatres worldwide"}
            </p>
          </div>
          <MovieGridList 
            category={category.movie} 
            type={movieType.now_playing} 
            filterByReleaseDate="past"
            filters={filters}
          />
        </div>

        <div className="section mb-3">
          <div className="section__header mb-2">
            <h2>Coming Soon</h2>
            <p className="section-subtitle" style={{ color: "rgba(255, 255, 255, 0.6)", fontSize: "1rem" }}>
              Upcoming releases
            </p>
          </div>
          <MovieGridList 
            category={category.movie} 
            type={movieType.upcoming} 
            filterByReleaseDate="future"
            filters={filters}
          />
        </div>
      </div>
    </>
  );
};

export default TheatreMovies;

