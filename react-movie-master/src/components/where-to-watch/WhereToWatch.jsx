import React, { useState, useEffect } from "react";
import "./where-to-watch.scss";

const WhereToWatch = ({ movieTitle, releaseDate }) => {
  const [platforms, setPlatforms] = useState([]);

  useEffect(() => {
    // Mock OTT availability based on movie age
    // In production, you'd call JustWatch API or TMDB watch providers
    const generatePlatforms = () => {
      const today = new Date();
      const release = new Date(releaseDate);
      const daysSinceRelease = Math.floor((today - release) / (1000 * 60 * 60 * 24));

      const allPlatforms = [
        { 
          name: "Netflix", 
          logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg",
          url: "https://www.netflix.com/search?q=" + encodeURIComponent(movieTitle),
          color: "#E50914"
        },
        { 
          name: "Amazon Prime Video", 
          logo: "https://upload.wikimedia.org/wikipedia/commons/1/11/Amazon_Prime_Video_logo.svg",
          url: "https://www.primevideo.com/search/ref=atv_nb_s?phrase=" + encodeURIComponent(movieTitle),
          color: "#00A8E1"
        },
        { 
          name: "Disney+ Hotstar", 
          logo: "https://upload.wikimedia.org/wikipedia/commons/1/1e/Disney%2B_Hotstar_logo.svg",
          url: "https://www.hotstar.com/in/search?q=" + encodeURIComponent(movieTitle),
          color: "#0F1014"
        },
        { 
          name: "Apple TV+", 
          logo: "https://upload.wikimedia.org/wikipedia/commons/2/28/Apple_TV_Plus_Logo.svg",
          url: "https://tv.apple.com/search?q=" + encodeURIComponent(movieTitle),
          color: "#000000"
        },
        { 
          name: "YouTube Movies", 
          logo: "https://upload.wikimedia.org/wikipedia/commons/0/09/YouTube_full-color_icon_%282017%29.svg",
          url: "https://www.youtube.com/results?search_query=" + encodeURIComponent(movieTitle + " full movie"),
          color: "#FF0000"
        },
        { 
          name: "Google Play Movies", 
          logo: "https://upload.wikimedia.org/wikipedia/commons/d/d3/Google_Play_Store_logo.svg",
          url: "https://play.google.com/store/search?q=" + encodeURIComponent(movieTitle),
          color: "#01875F"
        }
      ];

      // Show 3-5 random platforms for movies older than 45 days
      if (daysSinceRelease > 45) {
        const shuffled = allPlatforms.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, Math.floor(Math.random() * 3) + 3);
      }

      return [];
    };

    setPlatforms(generatePlatforms());
  }, [movieTitle, releaseDate]);

  if (platforms.length === 0) {
    return (
      <div className="where-to-watch">
        <h3 className="where-to-watch__title">
          <i className="bx bx-tv"></i>
          Where to Watch
        </h3>
        <p className="where-to-watch__unavailable">
          Not yet available on streaming platforms. Check back later!
        </p>
      </div>
    );
  }

  return (
    <div className="where-to-watch">
      <h3 className="where-to-watch__title">
        <i className="bx bx-tv"></i>
        Where to Watch Online
      </h3>
      <p className="where-to-watch__subtitle">
        This movie may be available on these platforms:
      </p>
      <div className="where-to-watch__platforms">
        {platforms.map((platform, index) => (
          <a
            key={index}
            href={platform.url}
            target="_blank"
            rel="noopener noreferrer"
            className="platform-card"
            style={{ "--platform-color": platform.color }}
          >
            <div className="platform-card__icon">
              <i className="bx bx-link-external"></i>
            </div>
            <div className="platform-card__content">
              <span className="platform-card__name">{platform.name}</span>
              <span className="platform-card__action">Check Availability →</span>
            </div>
          </a>
        ))}
      </div>
      <p className="where-to-watch__note">
        <i className="bx bx-info-circle"></i>
        Note: We don't stream movies directly. Click to check if available on these platforms.
      </p>
    </div>
  );
};

export default WhereToWatch;

