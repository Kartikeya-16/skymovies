import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import PageHeader from "../components/page-header/PageHeader";
import "./theatre-selection.scss";

const TheatreSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const movieDetails = location.state || {};

  // Location states
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  
  // Theatre states
  const [theatres, setTheatres] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [showtimes, setShowtimes] = useState([]);
  const [selectedTheatre, setSelectedTheatre] = useState(null);
  const [selectedShowtime, setSelectedShowtime] = useState(null);

  // Mock cities data (will be fetched from backend later)
  const mockCities = [
    {
      name: "Mumbai",
      areas: ["Andheri", "Bandra", "Juhu", "Lower Parel", "Powai", "Thane"]
    },
    {
      name: "Delhi",
      areas: ["Connaught Place", "Saket", "Vasant Kunj", "Dwarka", "Rohini", "Pitampura"]
    },
    {
      name: "Bangalore",
      areas: ["Koramangala", "Indiranagar", "Whitefield", "JP Nagar", "HSR Layout", "Electronic City"]
    },
    {
      name: "Hyderabad",
      areas: ["Banjara Hills", "Jubilee Hills", "Gachibowli", "Kukatpally", "Madhapur", "Hitech City"]
    },
    {
      name: "Pune",
      areas: ["Koregaon Park", "Viman Nagar", "Hinjewadi", "Wakad", "Aundh", "Kothrud"]
    },
    {
      name: "Chennai",
      areas: ["T Nagar", "Anna Nagar", "Velachery", "Adyar", "Nungambakkam", "OMR"]
    }
  ];

  // Generate theatres dynamically for any area
  const generateTheatresForArea = (area, city) => {
    const theatreChains = [
      {
        name: "PVR Cinemas",
        amenities: ["IMAX", "4DX", "Dolby Atmos", "Food Court"],
        screens: 8
      },
      {
        name: "INOX Megaplex",
        amenities: ["Premium Seats", "Dolby Atmos", "Food Court"],
        screens: 6
      },
      {
        name: "Cinepolis",
        amenities: ["4DX", "VIP Lounge", "Dolby Atmos", "Gourmet Food"],
        screens: 10
      }
    ];

    const showtimes = [
      ["10:00 AM", "01:00 PM", "04:00 PM", "07:00 PM", "10:00 PM"],
      ["10:30 AM", "01:30 PM", "04:30 PM", "07:30 PM", "10:30 PM"],
      ["11:00 AM", "02:00 PM", "05:00 PM", "08:00 PM", "11:00 PM"]
    ];

    return theatreChains.map((chain, index) => ({
      id: `${city}-${area}-${index}`,
      name: chain.name,
      area: area,
      city: city,
      address: `${area} Mall, ${area}, ${city}`,
      screens: chain.screens,
      amenities: chain.amenities,
      showtimes: showtimes[index]
    }));
  };

  // Generate next 7 days for date selection
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        full: date.toISOString().split('T')[0],
        display: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        date: date.getDate(),
        month: date.toLocaleDateString('en-US', { month: 'short' })
      });
    }
    return dates;
  };

  const dates = generateDates();

  useEffect(() => {
    setCities(mockCities);
    // Set today as default date
    setSelectedDate(dates[0].full);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // When city and area are selected, generate theatres for that area
    if (selectedCity && selectedArea) {
      const generatedTheatres = generateTheatresForArea(selectedArea, selectedCity);
      setTheatres(generatedTheatres);
    } else {
      setTheatres([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCity, selectedArea]);

  const handleCityChange = (e) => {
    setSelectedCity(e.target.value);
    setSelectedArea("");
    setTheatres([]);
    setSelectedTheatre(null);
    setSelectedShowtime(null);
  };

  const handleAreaChange = (e) => {
    setSelectedArea(e.target.value);
    setSelectedTheatre(null);
    setSelectedShowtime(null);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedShowtime(null);
  };

  const handleTheatreSelect = (theatre) => {
    setSelectedTheatre(theatre);
    setShowtimes(theatre.showtimes);
    setSelectedShowtime(null);
  };

  const handleShowtimeSelect = (time) => {
    setSelectedShowtime(time);
  };

  const handleProceedToSeats = () => {
    if (!selectedTheatre || !selectedShowtime) {
      alert("Please select a theatre and showtime");
      return;
    }

    // Navigate to seat selection with all details
    navigate("/seat-selection", {
      state: {
        ...movieDetails,
        city: selectedCity,
        area: selectedArea,
        theatre: selectedTheatre.name,
        theatreAddress: selectedTheatre.address,
        date: dates.find(d => d.full === selectedDate)?.display || selectedDate,
        showtime: selectedShowtime,
        movieTitle: movieDetails.title || "Movie Title",
      }
    });
  };

  const selectedCityData = cities.find(c => c.name === selectedCity);

  return (
    <>
      <PageHeader>Select Theatre & Showtime</PageHeader>

      <div className="container">
        <div className="theatre-selection-page">
          {/* Movie Info Banner */}
          {movieDetails.title && (
            <div className="movie-banner">
              <div className="movie-info">
                <h2>{movieDetails.title}</h2>
                {movieDetails.genres && (
                  <p className="genres">{movieDetails.genres.join(" • ")}</p>
                )}
              </div>
            </div>
          )}

          {/* Location Selection */}
          <div className="location-selection">
            <h3>📍 Select Your Location</h3>
            <div className="location-inputs">
              <div className="input-group">
                <label>City</label>
                <select value={selectedCity} onChange={handleCityChange}>
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city.name} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedCity && (
                <div className="input-group">
                  <label>Area</label>
                  <select value={selectedArea} onChange={handleAreaChange}>
                    <option value="">Select Area</option>
                    {selectedCityData?.areas.map((area) => (
                      <option key={area} value={area}>
                        {area}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Date Selection */}
          {selectedArea && (
            <div className="date-selection">
              <h3>📅 Select Date</h3>
              <div className="date-list">
                {dates.map((date) => (
                  <div
                    key={date.full}
                    className={`date-card ${selectedDate === date.full ? "active" : ""}`}
                    onClick={() => handleDateChange(date.full)}
                  >
                    <span className="day">{date.day}</span>
                    <span className="date-num">{date.date}</span>
                    <span className="month">{date.month}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Theatre List */}
          {theatres.length > 0 && (
            <div className="theatre-list">
              <h3>🎬 Available Theatres in {selectedArea}</h3>
              {theatres.map((theatre) => (
                <div
                  key={theatre.id}
                  className={`theatre-card ${selectedTheatre?.id === theatre.id ? "selected" : ""}`}
                  onClick={() => handleTheatreSelect(theatre)}
                >
                  <div className="theatre-info">
                    <h4>{theatre.name}</h4>
                    <p className="address">
                      <i className="bx bx-map"></i>
                      {theatre.address}
                    </p>
                    <div className="amenities">
                      {theatre.amenities.map((amenity) => (
                        <span key={amenity} className="amenity-tag">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  {selectedTheatre?.id === theatre.id && (
                    <div className="showtime-selection">
                      <h5>Select Showtime:</h5>
                      <div className="showtime-list">
                        {theatre.showtimes.map((time) => (
                          <button
                            key={time}
                            className={`showtime-btn ${selectedShowtime === time ? "active" : ""}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShowtimeSelect(time);
                            }}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* No Theatres Message */}
          {selectedArea && theatres.length === 0 && (
            <div className="no-theatres">
              <i className="bx bx-movie"></i>
              <p>No theatres found in {selectedArea}</p>
              <p className="hint">Try selecting a different area</p>
            </div>
          )}

          {/* Proceed Button */}
          {selectedShowtime && (
            <div className="proceed-section">
              <div className="selection-summary">
                <h4>Your Selection:</h4>
                <p><strong>Location:</strong> {selectedArea}, {selectedCity}</p>
                <p><strong>Theatre:</strong> {selectedTheatre.name}</p>
                <p><strong>Date:</strong> {dates.find(d => d.full === selectedDate)?.display}</p>
                <p><strong>Showtime:</strong> {selectedShowtime}</p>
              </div>
              <button className="btn-proceed" onClick={handleProceedToSeats}>
                <i className="bx bx-chair"></i>
                Proceed to Seat Selection
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TheatreSelection;

