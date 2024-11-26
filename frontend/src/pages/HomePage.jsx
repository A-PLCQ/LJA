import React from 'react';
import { Link } from 'react-router-dom';
import HeroSection from '../components/home/HeroSection';
import FeaturedProducts from '../components/home/FeaturedProducts';
import '../styles/HomePage.css';

const HomePage = () => {
  const featuredIds = [8, 9];

  return (
    <div className="home-page">
      <HeroSection />
      <FeaturedProducts ids={featuredIds} />
      <footer className="homepage-footer">
        <p>&copy; 2024 Impress2Print. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default HomePage;
