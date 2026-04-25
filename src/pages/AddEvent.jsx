import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImagePlus, Film, Calendar, MapPin, AlignLeft, Users } from 'lucide-react';
import './AddEvent.css';

const AddEvent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    type: 'Event',
    genre: '',
    duration: '',
    image: '',
    synopsis: '',
    cast: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('You must be logged in to add an event.');
      }

      // Convert cast comma separated string to array
      const castArray = formData.cast.split(',').map(s => s.trim()).filter(Boolean);

      const res = await fetch('/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          cast: castArray
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create event');
      }

      navigate('/'); // Redirect to home on success
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-event-page container">
      <div className="add-event-header">
        <h1>List Your Show</h1>
        <p>Fill out the details below to publish your event on ShowBooker.</p>
      </div>

      <div className="add-event-content">
        <form className="add-event-form" onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label>Event Title</label>
            <div className="input-with-icon">
              <Film size={20} />
              <input 
                type="text" 
                name="title" 
                placeholder="e.g. Rock the Arena 2026" 
                value={formData.title} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label>Type</label>
              <select name="type" value={formData.type} onChange={handleChange}>
                <option value="Event">Event</option>
                <option value="Movie">Movie</option>
                <option value="Concert">Concert</option>
                <option value="Comedy">Comedy</option>
                <option value="Sports">Sports</option>
                <option value="Workshop">Workshop</option>
              </select>
            </div>
            
            <div className="form-group half">
              <label>Genre</label>
              <input 
                type="text" 
                name="genre" 
                placeholder="e.g. Action, Standup Comedy" 
                value={formData.genre} 
                onChange={handleChange} 
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group half">
              <label>Duration</label>
              <div className="input-with-icon">
                <Calendar size={20} />
                <input 
                  type="text" 
                  name="duration" 
                  placeholder="e.g. 2h 30m" 
                  value={formData.duration} 
                  onChange={handleChange} 
                />
              </div>
            </div>
            
            <div className="form-group half">
              <label>Image URL</label>
              <div className="input-with-icon">
                <ImagePlus size={20} />
                <input 
                  type="url" 
                  name="image" 
                  placeholder="https://example.com/image.jpg" 
                  value={formData.image} 
                  onChange={handleChange} 
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Cast / Artists (comma separated)</label>
            <div className="input-with-icon">
              <Users size={20} />
              <input 
                type="text" 
                name="cast" 
                placeholder="e.g. John Doe, Jane Smith" 
                value={formData.cast} 
                onChange={handleChange} 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Synopsis / Description</label>
            <div className="input-with-icon align-top">
              <AlignLeft size={20} style={{marginTop: '12px'}}/>
              <textarea 
                name="synopsis" 
                placeholder="Tell us about your event..." 
                rows="5"
                value={formData.synopsis} 
                onChange={handleChange} 
                required
              ></textarea>
            </div>
          </div>

          <button type="submit" className="btn-primary submit-btn" disabled={loading}>
            {loading ? 'Publishing...' : 'Publish Event'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddEvent;
