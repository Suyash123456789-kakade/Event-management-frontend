import React from 'react';
import HeroCarousel from '../components/HeroCarousel';
import EventGrid from '../components/EventGrid';

const Home = () => {
  return (
    <div className="home-page">
      <HeroCarousel />
      <EventGrid />
    </div>
  );
};

export default Home;
