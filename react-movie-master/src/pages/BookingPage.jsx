import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../components/page-header/PageHeader";
import "./booking.scss";

const BookingPage = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);

  // Mock data - will be replaced with real data later
  const theatres = [
    {
      id: 1,
      name: "PVR Cinemas",
      location: "Mall Road",
      showtimes: ["10:00 AM", "01:00 PM", "04:00 PM", "07:00 PM", "10:00 PM"],
    },
    {
      id: 2,
      name: "INOX",
      location: "City Center",
      showtimes: ["11:00 AM", "02:00 PM", "05:00 PM", "08:00 PM"],
    },
    {
      id: 3,
      name: "Cinepolis",
      location: "Downtown Plaza",
      showtimes: ["12:00 PM", "03:00 PM", "06:00 PM", "09:00 PM"],
    },
  ];

  const handleTheatreSelect = (theatre) => {
    setSelectedTheatre(theatre);
    setSelectedShowtime(null);
  };

  const handleShowtimeSelect = (showtime) => {
    setSelectedShowtime(showtime);
  };

  const proceedToSeatSelection = () => {
    if (selectedTheatre && selectedShowtime) {
      navigate(`/seat-selection/${movieId}/${selectedTheatre.id}/${selectedShowtime}`);
    }
  };

  return (
    <>
      <PageHeader>Book Your Tickets</PageHeader>

      <div className="container">
        <div className="booking-page">
          <div className="booking-section">
            <h2 className="booking-section__title">Select Theatre</h2>
            <div className="theatre-list">
              {theatres.map((theatre) => (
                <div
                  key={theatre.id}
                  className={`theatre-card ${
                    selectedTheatre?.id === theatre.id ? "selected" : ""
                  }`}
                  onClick={() => handleTheatreSelect(theatre)}
                >
                  <h3>{theatre.name}</h3>
                  <p className="theatre-location">{theatre.location}</p>
                </div>
              ))}
            </div>
          </div>

          {selectedTheatre && (
            <div className="booking-section">
              <h2 className="booking-section__title">Select Showtime</h2>
              <div className="showtime-list">
                {selectedTheatre.showtimes.map((showtime, index) => (
                  <button
                    key={index}
                    className={`showtime-btn ${
                      selectedShowtime === showtime ? "selected" : ""
                    }`}
                    onClick={() => handleShowtimeSelect(showtime)}
                  >
                    {showtime}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedShowtime && (
            <div className="booking-section">
              <button className="btn-proceed" onClick={proceedToSeatSelection}>
                Proceed to Seat Selection
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default BookingPage;

