import React from "react";
import { Route, Routes as RouterRoutes } from "react-router-dom";

import Home from "../pages/Home";
import Catalog from "../pages/Catalog";
import Detail from "../pages/detail/Detail";
import TheatreMovies from "../pages/TheatreMovies";
import OnlineMovies from "../pages/OnlineMovies";
import BookingPage from "../pages/BookingPage";
import TheatreSelection from "../pages/TheatreSelection";
import SeatSelection from "../pages/SeatSelection";
import Payment from "../pages/Payment";
import BookingConfirmation from "../pages/BookingConfirmation";
import MyBookings from "../pages/MyBookings";
import MyWatchlist from "../pages/MyWatchlist";
import MyLibrary from "../pages/MyLibrary";
import Profile from "../pages/Profile";
import WatchOnline from "../pages/WatchOnline";
import SearchResults from "../pages/SearchResults";
import About from "../pages/About";
import Contact from "../pages/Contact";
import Terms from "../pages/Terms";
import Privacy from "../pages/Privacy";

import * as Config from "../constants/Config";

const Routes = () => {
  return (
    <RouterRoutes>
      {/* New Routes for Booking System */}
      <Route path="/theatre-movies" element={<TheatreMovies />} />
      <Route path="/online-movies" element={<OnlineMovies />} />
      <Route path="/booking/:movieId" element={<BookingPage />} />
      <Route path="/theatre-selection" element={<TheatreSelection />} />
      <Route path="/seat-selection" element={<SeatSelection />} />
      <Route path="/payment" element={<Payment />} />
      <Route path="/booking-confirmation" element={<BookingConfirmation />} />
      <Route path="/my-bookings" element={<MyBookings />} />
      <Route path="/my-watchlist" element={<MyWatchlist />} />
      <Route path="/my-library" element={<MyLibrary />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/watch/:movieId" element={<WatchOnline />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      
      {/* Original Routes */}
      <Route
        path={`/${Config.HOME_PAGE}/:category/search/:keyword`}
        element={<Catalog />}
      />
      <Route path={`/${Config.HOME_PAGE}/:category/:id`} element={<Detail />} />
      <Route path={`/${Config.HOME_PAGE}/:category`} element={<Catalog />} />
      <Route path={`/${Config.HOME_PAGE}`} element={<Home />} />
    </RouterRoutes>
  );
};

export default Routes;
