import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import Home from './pages/Home';
import EventDetails from './pages/EventDetails';
import AddEvent from './pages/AddEvent';
import MyBookings from './pages/MyBookings';
import './App.css';

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  // Simple session check (since we aren't validating token against API on every load for this demo)
  useEffect(() => {
    const token = localStorage.getItem('token');
    // If token exists, we simulate being logged in. In a real app, call /api/auth/me to verify.
    if (token) {
      setUser({ email: 'user@example.com' }); // Mock until full auth state is requested
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <Router>
      <div className="app-container">
        <Navbar 
          onSignInClick={() => setIsAuthModalOpen(true)} 
          user={user} 
          onLogout={handleLogout}
        />
        
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/event/:id" element={<EventDetails onBookClick={() => setIsAuthModalOpen(true)} />} />
            <Route path="/add-event" element={<AddEvent />} />
            <Route path="/my-bookings" element={<MyBookings />} />
          </Routes>
        </main>

        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)} 
          onLoginSuccess={handleLoginSuccess}
        />
        
        <footer className="footer">
          <div className="container">
            <p>© 2026 ShowBooker. All rights reserved.</p>
            <p className="footer-subtext">Premium Event Management Platform</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
