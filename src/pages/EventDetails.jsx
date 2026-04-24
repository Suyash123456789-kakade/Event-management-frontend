import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getItemById } from '../data';
import './EventDetails.css';

const EventDetails = ({ onBookClick }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const item = getItemById(id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!item) {
    return (
      <div className="not-found">
        <h2>Event Not Found</h2>
        <button className="btn-primary" onClick={() => navigate('/')}>Go Home</button>
      </div>
    );
  }

  return (
    <div className="event-details-page animate-fade-in">
      {/* Hero Banner Area */}
      <div className="details-hero">
        <div className="hero-bg" style={{ backgroundImage: `url(${item.image})` }}></div>
        <div className="hero-overlay"></div>
        <div className="container hero-content">
          <div className="poster-card animate-slide-up">
            <img src={item.image} alt={item.title} />
          </div>
          <div className="hero-info animate-slide-right">
            <h1>{item.title}</h1>
            <div className="meta-tags">
              <span className="rating-tag">★ {item.rating}</span>
              <span className="tag">{item.genre}</span>
              <span className="tag">{item.duration}</span>
            </div>
            <button className="btn-primary book-btn" onClick={onBookClick}>
              Book Tickets
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="container details-content">
        <div className="section">
          <h2>About</h2>
          <p>{item.synopsis}</p>
        </div>
        
        <div className="section">
          <h2>Cast & Crew</h2>
          <div className="cast-grid">
            {item.cast.map((actor, idx) => (
              <div key={idx} className="cast-card">
                <div className="cast-avatar">
                  {actor.charAt(0)}
                </div>
                <span>{actor}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetails;
