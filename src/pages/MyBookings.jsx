import React, { useState, useEffect } from 'react';
import { Ticket, Calendar, Clock, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './MyBookings.css';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/');
          return;
        }

        const res = await fetch('/api/bookings/my', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!res.ok) throw new Error('Failed to fetch bookings');
        
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [navigate]);

  if (loading) {
    return <div className="container" style={{padding: '50px 0', textAlign: 'center'}}>Loading your tickets...</div>;
  }

  return (
    <div className="my-bookings-page container animate-fade-in">
      <div className="page-header">
        <h1>My Tickets</h1>
        <p>View all your past and upcoming event bookings.</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {bookings.length === 0 && !error ? (
        <div className="no-bookings">
          <Ticket size={48} className="empty-icon" />
          <h2>No tickets found</h2>
          <p>Looks like you haven't booked any events yet.</p>
          <button className="btn-primary" onClick={() => navigate('/')}>Explore Events</button>
        </div>
      ) : (
        <div className="bookings-list">
          {bookings.map(booking => (
            <div key={booking.id} className="ticket-card animate-slide-up">
              <div className="ticket-image">
                <img src={booking.image} alt={booking.title} />
              </div>
              <div className="ticket-details">
                <h3>{booking.title}</h3>
                <div className="ticket-info-grid">
                  <div className="info-item">
                    <Calendar size={16} />
                    <span>{new Date(booking.booking_date).toLocaleDateString()}</span>
                  </div>
                  <div className="info-item">
                    <Clock size={16} />
                    <span>{booking.duration}</span>
                  </div>
                  <div className="info-item">
                    <Ticket size={16} />
                    <span>Seats: {booking.seats.join(', ')}</span>
                  </div>
                </div>
              </div>
              <div className="ticket-barcode">
                <div className="barcode-stripes">
                  {Array.from({length: 20}).map((_, i) => (
                    <div key={i} className="stripe" style={{width: Math.random() * 4 + 1 + 'px'}}></div>
                  ))}
                </div>
                <div className="ticket-price">₹{booking.total_price}</div>
                <div className="booking-id">ID: BMS{booking.id.toString().padStart(6, '0')}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
