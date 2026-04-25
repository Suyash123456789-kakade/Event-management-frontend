import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './HeroCarousel.css';

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch('/api/events');
        const data = await res.json();
        // Use first 3 events as carousel
        setMovies(data.slice(0, 3));
      } catch (err) {
        console.error(err);
      }
    };
    fetchMovies();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === movies.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? movies.length - 1 : prev - 1));
  };

  useEffect(() => {
    if (movies.length === 0) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [currentSlide, movies.length]);

  if (movies.length === 0) return null;

  return (
    <div className="carousel-container animate-fade-in">
      <div 
        className="carousel-track" 
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {movies.map((movie, index) => (
          <div key={movie.id} className="carousel-slide">
            <div 
              className="slide-image-wrapper" 
              onClick={() => navigate(`/event/${movie.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <img src={movie.image} alt={movie.title} />
              <div className="slide-gradient"></div>
              <div className="slide-content" style={{ position: 'absolute', bottom: '30px', left: '30px', color: 'white', zIndex: 10 }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>{movie.title}</h2>
                <p>{movie.genre}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button className="carousel-btn prev" onClick={prevSlide}>
        <ChevronLeft size={24} />
      </button>
      <button className="carousel-btn next" onClick={nextSlide}>
        <ChevronRight size={24} />
      </button>
      
      <div className="carousel-indicators">
        {movies.map((_, index) => (
          <div 
            key={index} 
            className={`indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
