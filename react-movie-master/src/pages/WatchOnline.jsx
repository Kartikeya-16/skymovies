import React, { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./watch-online.scss";

const WatchOnline = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(100);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration] = useState(0);
  const [showControls, setShowControls] = useState(true);

  // Mock movie data - will be fetched from backend
  const movieData = {
    id: movieId,
    title: "Inception",
    videoUrl: "https://www.youtube.com/embed/YoHD9XEInc0", // Sample video
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume / 100;
    }
  };

  // Video event handlers for future use with proper video element
  // const handleTimeUpdate = () => {
  //   if (videoRef.current) {
  //     setCurrentTime(videoRef.current.currentTime);
  //   }
  // };

  // const handleLoadedMetadata = () => {
  //   if (videoRef.current) {
  //     setDuration(videoRef.current.duration);
  //   }
  // };

  const handleSeek = (e) => {
    const newTime = e.target.value;
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="watch-online-page">
      <div
        className="video-container"
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(isPlaying ? false : true)}
      >
        <button className="back-btn" onClick={handleBack}>
          <i className="bx bx-arrow-back"></i>
          Back
        </button>

        <div className="video-wrapper">
          {/* For demo purposes, using iframe. In production, use proper video player */}
          <iframe
            ref={videoRef}
            src={movieData.videoUrl}
            title={movieData.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        {showControls && (
          <div className="video-controls">
            <div className="progress-bar">
              <input
                type="range"
                min="0"
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="progress-slider"
              />
            </div>

            <div className="controls-bottom">
              <div className="left-controls">
                <button className="control-btn" onClick={togglePlay}>
                  <i className={`bx ${isPlaying ? "bx-pause" : "bx-play"}`}></i>
                </button>
                <div className="volume-control">
                  <button className="control-btn">
                    <i className="bx bx-volume-full"></i>
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={handleVolumeChange}
                    className="volume-slider"
                  />
                </div>
                <div className="time-display">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </div>
              </div>

              <div className="right-controls">
                <button className="control-btn">
                  <i className="bx bx-cog"></i>
                </button>
                <button className="control-btn" onClick={toggleFullscreen}>
                  <i className="bx bx-fullscreen"></i>
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="movie-info-overlay">
          <h1>{movieData.title}</h1>
        </div>
      </div>

      <div className="container">
        <div className="video-details">
          <div className="actions-bar">
            <button className="action-btn">
              <i className="bx bx-heart"></i>
              Add to Watchlist
            </button>
            <button className="action-btn">
              <i className="bx bx-share-alt"></i>
              Share
            </button>
            <button className="action-btn">
              <i className="bx bx-download"></i>
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatchOnline;

