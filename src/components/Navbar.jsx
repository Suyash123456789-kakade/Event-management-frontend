import React, { useState } from 'react';
import { Search, ChevronDown, Menu, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ onSignInClick, user }) => {
  return (
    <nav className="navbar">
      <div className="container nav-container">
        <div className="nav-left">
          <Link to="/" className="logo" style={{textDecoration: 'none'}}>ShowBooker</Link>
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search for Movies, Events, Plays, Sports and Activities" 
            />
          </div>
        </div>
        
        <div className="nav-right">
          <div className="location-selector">
            Mumbai <ChevronDown size={16} />
          </div>
          
          {user ? (
            <div className="user-profile animate-fade-in">
              <User size={18} />
              <span>Hi, {user.phone}</span>
            </div>
          ) : (
            <button className="btn-primary sign-in-btn" onClick={onSignInClick}>
              Sign in
            </button>
          )}
          
          <div className="menu-icon">
            <Menu size={24} />
          </div>
        </div>
      </div>
      
      <div className="sub-nav">
        <div className="container sub-nav-container">
          <div className="sub-nav-left">
            <a href="#">Movies</a>
            <a href="#">Stream</a>
            <a href="#">Events</a>
            <a href="#">Plays</a>
            <a href="#">Sports</a>
            <a href="#">Activities</a>
          </div>
          <div className="sub-nav-right">
            <a href="#">ListYourShow</a>
            <a href="#">Corporates</a>
            <a href="#">Offers</a>
            <a href="#">Gift Cards</a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
