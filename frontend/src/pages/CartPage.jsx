import React from 'react';
import '../../styles/CartPage.css';

const CartPage = () => {
  return (
    <div className="cart-page-container">
      <header className="cart-header">
        <h1>Mon Panier</h1>
        <p>Vérifiez vos articles avant de passer à la caisse.</p>
      </header>

      <section className="cart-items-list">
        <div className="cart-item">
          <h2>Imprimante A</h2>
          <p>Quantité : 1</p>
          <p>Prix : 299,99 €</p>
          <button className="remove-item-button">Supprimer</button>
        </div>

        <div className="cart-item">
          <h2>Consommable X</h2>
          <p>Quantité : 2</p>
          <p>Prix : 49,99 € chacun</p>
          <button className="remove-item-button">Supprimer</button>
        </div>
      </section>

      <footer className="cart-footer">
        <h2>Total : 399,97 €</h2>
        <button className="checkout-button">Passer à la caisse</button>
      </footer>
    </div>
  );
};

export default CartPage;
