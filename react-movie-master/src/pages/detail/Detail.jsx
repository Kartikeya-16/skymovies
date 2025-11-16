import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import tmdbApi from "./../../api/tmdbApi";
import apiConfig from "../../api/apiConfig";

import "./detail.scss";
import CastList from "./CastList";
import VideoList from "./VideoList";
import Recommendations from "../../components/recommendations/Recommendations";
import WhereToWatch from "../../components/where-to-watch/WhereToWatch";
import WatchlistButton from "../../components/watchlist-button/WatchlistButton";
import { OutlineButton } from "../../components/button/Button";

const Detail = () => {
  const { category, id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [availability, setAvailability] = useState({
    bookable: false,
    streamable: false,
    loading: true
  });

  useEffect(() => {
    const getDetail = async () => {
      const response = await tmdbApi.detail(category, id, { params: {} });
      setItem(response);
      window.scrollTo(0, 0);
    };
    getDetail();
  }, [category, id]);

  useEffect(() => {
    const checkAvailability = async () => {
      if (!item || !item.release_date) {
        // No release date available - assume it's streamable only
        setAvailability({ bookable: false, streamable: true, loading: false });
        return;
      }

      try {
        const releaseDate = new Date(item.release_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to start of day
        releaseDate.setHours(0, 0, 0, 0);
        
        const daysSinceRelease = Math.floor((today - releaseDate) / (1000 * 60 * 60 * 24));
        
        // Logic for availability:
        // - Upcoming (not released yet, daysSinceRelease < 0): Cannot book or stream
        // - Currently in theatres (0-60 days): Book tickets only (show Book Ticket button)
        // - Older (60+ days): Online streaming only (NO Book Ticket button)
        
        let isBookable = false;
        let isStreamable = false;
        
        if (daysSinceRelease < 0) {
          // Upcoming movie - not available yet
          isBookable = false;
          isStreamable = false;
        } else if (daysSinceRelease <= 60) {
          // Currently in theatres (0-60 days) - show Book Ticket button
          isBookable = true;
          isStreamable = false;
        } else {
          // Old release - only online streaming (60+ days) - NO Book Ticket button
          isBookable = false;
          isStreamable = true;
        }
        
        setAvailability({
          bookable: isBookable,
          streamable: isStreamable,
          loading: false
        });
      } catch (error) {
        console.error('Error determining availability:', error);
        // Default: make old movies streamable only
        setAvailability({
          bookable: false,
          streamable: true,
          loading: false
        });
      }
    };

    checkAvailability();
  }, [item]);

  const handleBookTicket = () => {
    // Navigate to theatre selection with movie details
    navigate({
      pathname: "/theatre-selection",
      state: {
        id: item.id,
        title: item.title || item.name,
        posterPath: item.poster_path,
        backdropPath: item.backdrop_path,
        genres: item.genres?.map(g => g.name) || [],
        rating: item.vote_average,
        releaseDate: item.release_date || item.first_air_date,
      }
    });
  };


  return (
    <>
      {item && (
        <>
          <div
            className="banner"
            style={{
              backgroundImage: `url(${apiConfig.originalImage(
                item.backdrop_path || item.poster_path
              )})`,
            }}
          ></div>

          <div className="mb-3 movie-content container">
            <div className="movie-content__poster">
              <div
                className="movie-content__poster__img"
                style={{
                  backgroundImage: `url(${apiConfig.originalImage(
                    item.backdrop_path || item.poster_path
                  )})`,
                }}
              ></div>
            </div>

            <div className="movie-content__info">
              <h1 className="title">{item.title || item.name}</h1>
              <div className="genres">
                {item.genres &&
                  item.genres.slice(0, 5).map((genre, index) => (
                    <span key={index} className="genres__item">
                      {genre.name}
                    </span>
                  ))}
              </div>
              <p className="overview">{item.overview}</p>
              
              <div className="btns">
                {availability.loading ? (
                  <p style={{ color: '#888', fontSize: '0.9rem' }}>Checking availability...</p>
                ) : (
                  <>
                    {availability.bookable && (
                      <OutlineButton className="small" onClick={handleBookTicket}>
                        Book Ticket
                      </OutlineButton>
                    )}
                    <WatchlistButton 
                      movieId={item.id}
                      movieTitle={item.title || item.name}
                      posterPath={item.poster_path}
                    />
                    {!availability.bookable && !availability.streamable && (
                      <p style={{ color: '#888', fontSize: '0.9rem', width: '100%', marginTop: '1rem' }}>
                        {item.release_date && new Date(item.release_date) > new Date() 
                          ? `Coming soon! Releases on ${new Date(item.release_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`
                          : 'This movie is not currently available for booking'
                        }
                      </p>
                    )}
                  </>
                )}
              </div>

              <div className="cast">
                <div className="section__header">
                  <h2>Casts</h2>
                </div>
                {/* casts list */}
                <CastList id={item.id} />
              </div>
            </div>
          </div>

          <div className="container">
            <div className="section mb-3">
              <VideoList id={item.id} />
            </div>
            
            {/* Where to Watch Section */}
            <div className="section mb-3">
              <WhereToWatch 
                movieTitle={item.title || item.name}
                releaseDate={item.release_date || item.first_air_date}
              />
            </div>
            
            <div className="section mb-3">
              <Recommendations category={category} currentMovieId={item.id} />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Detail;
