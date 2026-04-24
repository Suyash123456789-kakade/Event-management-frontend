import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import Home from './pages/Home';
import EventDetails from './pages/EventDetails';
import './App.css';

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
  };

  return (
    <Router>
      <div className="app-container">
        <Navbar 
          onSignInClick={() => setIsAuthModalOpen(true)} 
          user={user} 
        />
        
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/event/:id" element={<EventDetails onBookClick={() => setIsAuthModalOpen(true)} />} />
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
