import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = ({ isLoggedIn }) => {
  useEffect(() => {
    class MobileNavbar {
      constructor(mobileMenu, navList, navLinks) {
        this.mobileMenu = document.querySelector(mobileMenu);
        this.navList = document.querySelector(navList);
        this.navLinks = document.querySelectorAll(navLinks);
        this.activeClass = "active";
        this.handleClick = this.handleClick.bind(this);
      }

      animateLinks() {
        this.navLinks.forEach((link, index) => {
          link.style.animation = link.style.animation
            ? ""
            : `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
        });
      }

      handleClick() {
        const isExpanded = this.mobileMenu.getAttribute("aria-expanded") === "true" || false;
        this.navList.classList.toggle(this.activeClass);
        this.mobileMenu.classList.toggle(this.activeClass);
        this.mobileMenu.setAttribute("aria-expanded", !isExpanded);
        this.animateLinks();
      }

      addClickEvent() {
        this.mobileMenu.addEventListener("click", this.handleClick);
      }

      init() {
        if (this.mobileMenu) {
          this.addClickEvent(); 
        }
      }
    }

    const mobileNavbar = new MobileNavbar(
      ".mobile-menu",
      ".nav-list",
      ".nav-list li"
    );
    mobileNavbar.init();
  }, []);

  return (
    <nav>
      <a className="logo" href="/" aria-label="Page d'accueil">
        <img src="../assets/img/impress2print" alt="Impress2Print" />
      </a>
      
      <div className="group">
        <svg className="icon" aria-hidden="true" viewBox="0 0 24 24">
          <g>
            <path d="M21.53 20.47l-3.66-3.66C19.195 15.24 20 13.214 20 11c0-4.97-4.03-9-9-9s-9 4.03-9 9 4.03 9 9 9c2.215 0 4.24-.804 5.808-2.13l3.66 3.66c.147.146.34.22.53.22s.385-.073.53-.22c.295-.293.295-.767.002-1.06zM3.5 11c0-4.135 3.365-7.5 7.5-7.5s7.5 3.365 7.5 7.5-3.365 7.5-7.5 7.5-7.5-3.365-7.5-7.5z"></path>
          </g>
        </svg>
        <input placeholder="Rechercher" type="search" className="input" aria-label="Rechercher des produits" />
      </div>
      <div className="mobile-menu">
        <div className="ligne1"></div>
        <div className="ligne2"></div>
        <div className="ligne3"></div> 
      </div>
      <ul className="nav-list">
        <li><Link to="/">Accueil</Link></li>
        <li><Link to="/products">Produits</Link></li>
        <li><Link to="/cart">Panier</Link></li>
        <li>
          {isLoggedIn ? (
            <Link to="/account">Compte</Link>
          ) : (
            <Link to="/login">Connexion</Link>
          )}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
