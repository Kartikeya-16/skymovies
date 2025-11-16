import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import "./movie-list.scss";

import { SwiperSlide, Swiper } from "swiper/react";

import MovieCard from "../movie-card/MovieCard";

import tmdbApi, { category } from "./../../api/tmdbApi";

const MovieList = (props) => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const getList = async () => {
      let response = null;
      const params = {};

      if (props.type !== "similar") {
        switch (props.category) {
          case category.movie:
            response = await tmdbApi.getMoviesList(props.type, { params });
            break;
          default:
            response = await tmdbApi.getTvList(props.type, { params });
        }
      } else {
        response = await tmdbApi.similar(props.category, props.id);
      }
      
      let results = response.results;
      
      // Apply release date filter
      if (props.filterByReleaseDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        results = results.filter(item => {
          if (!item.release_date) return false;
          const releaseDate = new Date(item.release_date);
          releaseDate.setHours(0, 0, 0, 0);
          
          if (props.filterByReleaseDate === 'past') {
            return releaseDate <= today;
          } else if (props.filterByReleaseDate === 'future') {
            return releaseDate > today;
          }
          return true;
        });
      }
      
      // Apply user filters (genre, language, rating)
      if (props.filters) {
        // Filter by genre
        if (props.filters.genre && props.filters.genre !== 'all') {
          const genreId = parseInt(props.filters.genre);
          results = results.filter(item => 
            item.genre_ids && item.genre_ids.includes(genreId)
          );
        }
        
        // Filter by language
        if (props.filters.language && props.filters.language !== 'all') {
          results = results.filter(item => 
            item.original_language === props.filters.language
          );
        }
        
        // Filter by rating
        if (props.filters.rating && props.filters.rating !== 'all') {
          const minRating = parseFloat(props.filters.rating);
          results = results.filter(item => 
            item.vote_average >= minRating
          );
        }
        
        // Sort by
        if (props.filters.sortBy) {
          results = [...results].sort((a, b) => {
            switch (props.filters.sortBy) {
              case 'popularity':
                return (b.popularity || 0) - (a.popularity || 0);
              case 'release_date':
                return new Date(b.release_date || 0) - new Date(a.release_date || 0);
              case 'rating':
                return (b.vote_average || 0) - (a.vote_average || 0);
              case 'title':
                return (a.title || a.name || '').localeCompare(b.title || b.name || '');
              default:
                return 0;
            }
          });
        }
      }
      
      setItems(results);
    };
    getList();
  }, [props.category, props.id, props.type, props.filterByReleaseDate, props.filters]);

  return (
    <div className="movie-list">
      <Swiper grabCursor={true} spaceBetween={10} slidesPerView={"auto"}>
        {items.map((item, index) => (
          <SwiperSlide key={index}>
            <MovieCard item={item} category={props.category} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

MovieList.propTypes = {
  category: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
};

export default MovieList;
