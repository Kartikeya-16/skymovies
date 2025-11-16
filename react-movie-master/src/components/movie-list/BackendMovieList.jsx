import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import "./movie-list.scss";

import { SwiperSlide, Swiper } from "swiper/react";

import MovieCard from "../movie-card/MovieCard";

import tmdbApi from "./../../api/tmdbApi";

const BackendMovieList = ({ tmdbIds, category, emptyMessage }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!tmdbIds || tmdbIds.length === 0) {
        setItems([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Fetch details for each TMDB ID
        const moviePromises = tmdbIds.map(id => 
          tmdbApi.detail(category, id, { params: {} })
        );
        
        const movies = await Promise.all(moviePromises);
        setItems(movies);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching movie details:', error);
        setItems([]);
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [tmdbIds, category]);

  if (loading) {
    return (
      <div className="movie-list">
        <p style={{ color: '#888', padding: '2rem' }}>Loading movies...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="movie-list">
        <p style={{ color: '#888', padding: '2rem' }}>
          {emptyMessage || 'No movies available'}
        </p>
      </div>
    );
  }

  return (
    <div className="movie-list">
      <Swiper grabCursor={true} spaceBetween={10} slidesPerView={"auto"}>
        {items.map((item, index) => (
          <SwiperSlide key={index}>
            <MovieCard item={item} category={category} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

BackendMovieList.propTypes = {
  tmdbIds: PropTypes.array.isRequired,
  category: PropTypes.string.isRequired,
  emptyMessage: PropTypes.string,
};

export default BackendMovieList;

