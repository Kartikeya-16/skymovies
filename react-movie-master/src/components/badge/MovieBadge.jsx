import React from "react";
import "./movie-badge.scss";

const MovieBadge = ({ type, text, className = "" }) => {
  // type: theatre, online, new, trending, hd, 4k, etc.
  return (
    <span className={`movie-badge ${type} ${className}`}>
      {type === "theatre" && <i className="bx bx-movie"></i>}
      {type === "online" && <i className="bx bx-play-circle"></i>}
      {type === "new" && <i className="bx bx-star"></i>}
      {type === "trending" && <i className="bx bx-trending-up"></i>}
      {type === "hd" && <i className="bx bx-hd"></i>}
      {type === "4k" && <span className="badge-text">4K</span>}
      {text && <span className="badge-text">{text}</span>}
    </span>
  );
};

export default MovieBadge;

