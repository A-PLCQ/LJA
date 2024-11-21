import React from 'react';
import { Link } from 'react-router-dom';
// import '../../styles/ProductsPage.css';

const ProductsPage = () => {
  return (
    <div className="products-page-container">
      <header className="products-header">
        <h1>Nos Produits</h1>
        <p>Explorez notre sélection d'imprimantes professionnelles et de consommables.</p>
      </header>

      <section className="products-list">
        <div className="product-card">
          <h2>Imprimante A</h2>
          <p>Imprimante haute performance pour usage professionnel.</p>
          <Link to="/products/1" className="product-link">Voir les détails</Link>
        </div>

        <div className="product-card">
          <h2>Imprimante B</h2>
          <p>Imprimante compacte pour des besoins d'impression variés.</p>
          <Link to="/products/2" className="product-link">Voir les détails</Link>
        </div>

        <div className="product-card">
          <h2>Consommable X</h2>
          <p>Cartouche de toner compatible avec plusieurs modèles d'imprimantes.</p>
          <Link to="/products/3" className="product-link">Voir les détails</Link>
        </div>
      </section>
    </div>
  );
};

export default ProductsPage;