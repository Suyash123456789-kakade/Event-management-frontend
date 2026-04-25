import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './EventGrid.css';

const EventGrid = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('/api/events');
        const data = await res.json();
        setEvents(data);
      } catch (err) {
        console.error('Failed to fetch events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  if (loading) {
    return <div className="container" style={{padding: '50px 0', textAlign: 'center'}}>Loading amazing events...</div>;
  }

  return (
    <div className="container event-section animate-slide-up">
      <div className="section-header">
        <h2>Recommended Events</h2>
        <a href="#" className="see-all">See All ›</a>
      </div>
      
      <div className="event-grid">
        {events.map((evt) => (
          <div 
            key={evt.id} 
            className="event-card"
            onClick={() => navigate(`/event/${evt.id}`)}
          >
            <div className="card-image-wrapper">
              <img src={evt.image} alt={evt.title} />
              <div className="rating-badge">★ {evt.rating}/10</div>
            </div>
            <div className="card-info">
              <h3>{evt.title}</h3>
              <p>{evt.genre}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventGrid;
