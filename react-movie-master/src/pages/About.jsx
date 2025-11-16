import React from "react";
import PageHeader from "../components/page-header/PageHeader";
import "./about.scss";

const About = () => {
  return (
    <>
      <PageHeader>About Us</PageHeader>
      <div className="container">
        <div className="about-page">
          <div className="about-content">
            <div className="about-section">
              <h2>Welcome to hMovies</h2>
              <p>
                hMovies is your premier destination for discovering and booking movie tickets. 
                We're not just another movie website - we're your complete movie experience platform.
              </p>
            </div>

            <div className="about-section">
              <h3>What We Do</h3>
              <ul>
                <li>
                  <i className="bx bx-movie"></i>
                  <div>
                    <strong>Theatre Bookings</strong>
                    <p>Book tickets for movies currently showing in theatres near you</p>
                  </div>
                </li>
                <li>
                  <i className="bx bx-tv"></i>
                  <div>
                    <strong>Streaming Discovery</strong>
                    <p>Find where to watch movies online on popular OTT platforms</p>
                  </div>
                </li>
                <li>
                  <i className="bx bx-bookmark"></i>
                  <div>
                    <strong>Watchlist</strong>
                    <p>Save movies you want to watch or book later</p>
                  </div>
                </li>
                <li>
                  <i className="bx bx-search"></i>
                  <div>
                    <strong>Movie Discovery</strong>
                    <p>Browse thousands of movies, search, filter, and discover new favorites</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="about-section">
              <h3>Our Mission</h3>
              <p>
                To make movie discovery and booking seamless, enjoyable, and accessible to everyone. 
                We believe that finding and watching great movies should be easy and fun.
              </p>
            </div>

            <div className="about-section">
              <h3>Why Choose Us?</h3>
              <div className="features-grid">
                <div className="feature-card">
                  <i className="bx bx-shield"></i>
                  <h4>Secure Booking</h4>
                  <p>Safe and secure payment processing</p>
                </div>
                <div className="feature-card">
                  <i className="bx bx-time"></i>
                  <h4>Real-time Availability</h4>
                  <p>Up-to-date showtimes and seat availability</p>
                </div>
                <div className="feature-card">
                  <i className="bx bx-mobile"></i>
                  <h4>Mobile Friendly</h4>
                  <p>Works perfectly on all devices</p>
                </div>
                <div className="feature-card">
                  <i className="bx bx-support"></i>
                  <h4>24/7 Support</h4>
                  <p>We're here to help whenever you need us</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;

