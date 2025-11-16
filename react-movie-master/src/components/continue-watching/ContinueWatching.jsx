import React from "react";
import { useNavigate } from "react-router-dom";
import "./continue-watching.scss";

const ContinueWatching = () => {
  const navigate = useNavigate();

  // Mock data - will be fetched from backend based on user's viewing history
  const continueWatchingItems = [
    {
      id: 1,
      title: "Inception",
      progress: 45, // percentage
      thumbnail: "https://via.placeholder.com/400x225?text=Inception",
      duration: "148 min",
      lastWatched: "2 days ago",
    },
    {
      id: 2,
      title: "The Dark Knight",
      progress: 78,
      thumbnail: "https://via.placeholder.com/400x225?text=The+Dark+Knight",
      duration: "152 min",
      lastWatched: "Yesterday",
    },
    {
      id: 3,
      title: "Interstellar",
      progress: 23,
      thumbnail: "https://via.placeholder.com/400x225?text=Interstellar",
      duration: "169 min",
      lastWatched: "Today",
    },
  ];

  const handleContinueWatching = (movieId) => {
    navigate(`/watch/${movieId}`);
  };

  if (continueWatchingItems.length === 0) {
    return null;
  }

  return (
    <div className="continue-watching-section">
      <div className="section__header">
        <div className="header-content">
          <i className="bx bx-time-five"></i>
          <h2>Continue Watching</h2>
        </div>
      </div>

      <div className="continue-watching-list">
        {continueWatchingItems.map((item) => (
          <div
            key={item.id}
            className="continue-watching-item"
            onClick={() => handleContinueWatching(item.id)}
          >
            <div className="thumbnail-wrapper">
              <img src={item.thumbnail} alt={item.title} />
              <div className="play-overlay">
                <i className="bx bx-play-circle"></i>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${item.progress}%` }}
                ></div>
              </div>
            </div>
            <div className="item-info">
              <h3 className="item-title">{item.title}</h3>
              <div className="item-meta">
                <span className="duration">{item.duration}</span>
                <span className="separator">•</span>
                <span className="last-watched">{item.lastWatched}</span>
              </div>
              <p className="progress-text">{item.progress}% watched</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContinueWatching;

