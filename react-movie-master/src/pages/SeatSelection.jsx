import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PageHeader from "../components/page-header/PageHeader";
import "./seat-selection.scss";

const SeatSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const bookingData = location.state || {};
  
  const [selectedSeats, setSelectedSeats] = useState([]);

  // Mock seat layout - will be dynamic later
  const rows = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const seatsPerRow = 12;

  // Mock seat status
  const bookedSeats = ["A5", "A6", "B3", "C7", "D8", "E4"];
  
  const seatPrices = {
    A: 150, B: 150, C: 150, // Premium
    D: 200, E: 200, F: 200, // Gold
    G: 250, H: 250, // Platinum
  };

  const getSeatType = (row) => {
    if (["A", "B", "C"].includes(row)) return "premium";
    if (["D", "E", "F"].includes(row)) return "gold";
    return "platinum";
  };

  const handleSeatClick = (seatId, row) => {
    if (bookedSeats.includes(seatId)) return;

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const calculateTotal = () => {
    return selectedSeats.reduce((total, seatId) => {
      const row = seatId[0];
      return total + seatPrices[row];
    }, 0);
  };

  const proceedToPayment = () => {
    if (selectedSeats.length > 0) {
      navigate("/payment", {
        state: {
          ...bookingData,
          seats: selectedSeats,
          total: calculateTotal(),
          movieTitle: bookingData.movieTitle || bookingData.title || "Movie Title",
          theatre: bookingData.theatre || "Theatre Name",
          showtime: bookingData.showtime || "N/A",
          date: bookingData.date || new Date().toLocaleDateString(),
        },
      });
    }
  };

  return (
    <>
      <PageHeader>Select Your Seats</PageHeader>

      <div className="container">
        <div className="seat-selection-page">
          {/* Booking Info Banner */}
          {bookingData.movieTitle && (
            <div className="booking-info-banner">
              <h3>{bookingData.movieTitle}</h3>
              <p>{bookingData.theatre} • {bookingData.date} • {bookingData.showtime}</p>
            </div>
          )}

          <div className="screen">
            <div className="screen-label">SCREEN</div>
          </div>

          <div className="seat-layout">
            {rows.map((row) => (
              <div key={row} className="seat-row">
                <span className="row-label">{row}</span>
                <div className="seats">
                  {[...Array(seatsPerRow)].map((_, index) => {
                    const seatNumber = index + 1;
                    const seatId = `${row}${seatNumber}`;
                    const isBooked = bookedSeats.includes(seatId);
                    const isSelected = selectedSeats.includes(seatId);
                    const seatType = getSeatType(row);

                    return (
                      <button
                        key={seatId}
                        className={`seat ${seatType} ${
                          isBooked ? "booked" : ""
                        } ${isSelected ? "selected" : ""}`}
                        onClick={() => handleSeatClick(seatId, row)}
                        disabled={isBooked}
                      >
                        {seatNumber}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="seat-legend">
            <div className="legend-item">
              <div className="legend-box available"></div>
              <span>Available</span>
            </div>
            <div className="legend-item">
              <div className="legend-box selected"></div>
              <span>Selected</span>
            </div>
            <div className="legend-item">
              <div className="legend-box booked"></div>
              <span>Booked</span>
            </div>
          </div>

          <div className="pricing-info">
            <div className="price-row">
              <span>Premium (A-C)</span>
              <span>₹150</span>
            </div>
            <div className="price-row">
              <span>Gold (D-F)</span>
              <span>₹200</span>
            </div>
            <div className="price-row">
              <span>Platinum (G-H)</span>
              <span>₹250</span>
            </div>
          </div>

          {selectedSeats.length > 0 && (
            <div className="booking-summary">
              <div className="summary-content">
                <div className="selected-seats-info">
                  <h3>Selected Seats: {selectedSeats.join(", ")}</h3>
                  <p>Total Seats: {selectedSeats.length}</p>
                </div>
                <div className="total-price">
                  <h3>Total: ₹{calculateTotal()}</h3>
                </div>
              </div>
              <button className="btn-proceed" onClick={proceedToPayment}>
                Proceed to Payment
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SeatSelection;

