import React from "react";

import "./footer.scss";

import { Link } from "react-router-dom";

import bg from "./../../assets/footer-bg.jpg";

import * as Config from "./../../constants/Config";

const Footer = () => {
  return (
    <div className="footer" style={{ backgroundImage: `url(${bg})` }}>
      <div className="footer__content container">
        <div className="footer__content__logo">
          <div className="logo">
            <Link to={`/${Config.HOME_PAGE}`}>Sky Movies</Link>
          </div>
        </div>

        <div className="footer__content__menus">
          <div className="footer__content__menu">
            <h4>Quick Links</h4>
            <Link to={`/${Config.HOME_PAGE}`}>Home</Link>
            <Link to="/theatre-movies">Theatre Movies</Link>
            <Link to="/online-movies">Streaming Movies</Link>
            <Link to="/my-watchlist">My Watchlist</Link>
            <Link to="/my-bookings">My Bookings</Link>
          </div>
          <div className="footer__content__menu">
            <h4>Company</h4>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact Us</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
          <div className="footer__content__menu">
            <h4>Legal</h4>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/privacy">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
