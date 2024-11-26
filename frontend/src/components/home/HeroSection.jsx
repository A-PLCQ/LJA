import React from 'react';
import '../../styles/HeroSection.css';
import heroImage from '../../assets/img/hero-background.png';

const HeroSection = () => {
  return (
    <section className="hero-section" style={{ backgroundImage: `url(${heroImage})` }}>
      <div className="hero-overlay">
        <div className="hero-content">
          <h1 className="hero-title">Optimisez votre impression professionnelle</h1>
          <p className="hero-subtitle">
            Des imprimantes, copieurs, et consommables de haute qualité pour répondre à toutes vos exigences professionnelles. Fiabilité, performance, et livraison rapide garanties.
          </p>
          <div className="hero-buttons">
            <a href="/products" className="btn-primary">Découvrez nos solutions d'impression</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
