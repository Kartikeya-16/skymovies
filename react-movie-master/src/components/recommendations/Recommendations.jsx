import React from "react";
import { Link } from "react-router-dom";
import MovieList from "../movie-list/MovieList";
import { OutlineButton } from "../button/Button";
import "./recommendations.scss";

const Recommendations = ({ category, currentMovieId, userPreferences = {} }) => {
  // This component will show personalized recommendations
  // For now, it shows similar movies

  return (
    <div className="recommendations-section">
      <div className="section__header mb-2">
        <div className="header-content">
          <i className="bx bx-bulb"></i>
          <div>
            <h2>Recommended For You</h2>
            <p className="recommendation-subtitle">
              Based on your viewing history and preferences
            </p>
          </div>
        </div>
        <Link to="/recommendations">
          <OutlineButton className="small">View All</OutlineButton>
        </Link>
      </div>
      <MovieList category={category} type="similar" id={currentMovieId} />
    </div>
  );
};

export default Recommendations;

