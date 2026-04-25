import React, { useState } from 'react';
import { Search, ChevronDown, Menu, User, LogOut, PlusCircle, Ticket } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = ({ onSignInClick, user, onLogout }) => {
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
            <div className="user-profile animate-fade-in" style={{display: 'flex', gap: '15px', alignItems: 'center'}}>
              <Link to="/add-event" className="add-event-btn" style={{display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'none', color: '#f84464', fontWeight: '500'}}>
                <PlusCircle size={18} />
                <span>Add Event</span>
              </Link>
              <Link to="/my-bookings" className="my-tickets-btn" style={{display: 'flex', alignItems: 'center', gap: '5px', textDecoration: 'none', color: '#333', fontWeight: '500'}}>
                <Ticket size={18} />
                <span>Tickets</span>
              </Link>
              <div style={{display: 'flex', alignItems: 'center', gap: '5px'}}>
                <User size={18} />
                <span style={{fontSize: '0.9rem'}}>{user.email ? user.email.split('@')[0] : 'User'}</span>
              </div>
              <button onClick={onLogout} style={{background: 'none', border: 'none', cursor: 'pointer', color: '#333', display: 'flex', alignItems: 'center'}}>
                <LogOut size={18} />
              </button>
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
