import React from 'react';
import { Link } from 'react-router-dom';
// import '../../styles/HomePage.css';

const HomePage = () => {
  return (
    <div className="homepage-container">
      <header className="homepage-header">
        <h1>Bienvenue chez Impress2Print</h1>
        <p>Votre spécialiste en imprimantes professionnelles et consommables.</p>
        <Link to="/products" className="homepage-cta-button">Voir nos produits</Link>
      </header>

      <section className="products-preview">
        <h2>Nos Catégories</h2>
        <div className="categories-container">
          <div className="category-card">
            <h3>Imprimantes</h3>
            <p>Découvrez notre large sélection d'imprimantes adaptées à vos besoins professionnels.</p>
            <Link to="/products" className="category-link">Voir les imprimantes</Link>
          </div>
          <div className="category-card">
            <h3>Consommables</h3>
            <p>Explorez nos toners, cartouches et autres consommables pour vos imprimantes.</p>
            <Link to="/products" className="category-link">Voir les consommables</Link>
          </div>
        </div>
      </section>

      <section className="about-us">
        <h2>À propos de nous</h2>
        <p>Chez Impress2Print, nous nous engageons à offrir la meilleure qualité d'impression pour les professionnels. Que vous ayez besoin d'une imprimante de haute performance ou de consommables fiables, nous sommes là pour vous aider à chaque étape.</p>
      </section>

      <footer className="homepage-footer">
        <p>&copy; 2024 Impress2Print. Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default HomePage;
