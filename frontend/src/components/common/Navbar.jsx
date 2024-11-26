import React, { useEffect, useRef, useState } from 'react'; 
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../../redux/slices/userSlice';
import '../../styles/Navbar.css';
import logo from '../../assets/img/logo.png';
import logoMini from '../../assets/img/logo-mini.png';
import cart from '../../assets/icons/cart.svg';
import utilisateur from '../../assets/icons/utilisateur.svg';
import utilisateurco from '../../assets/icons/utilisateurco.svg'
import catalogue from '../../assets/icons/catalogue.svg';

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user); // Utilisation de Redux pour vérifier si l'utilisateur est connecté
  const isLoggedIn = !!user;

  // Références pour les éléments du menu mobile
  const mobileMenuRef = useRef(null);
  const navListRef = useRef(null);

  // Gestion de la source du logo
  const [currentLogo, setCurrentLogo] = useState(logo);

  // Gestion de la déconnexion
  const handleLogout = () => {
    dispatch(logoutUser());
  };

  // Mobile Navbar Logic
  useEffect(() => {
    const handleClick = () => {
      if (mobileMenuRef.current && navListRef.current) {
        const isExpanded = mobileMenuRef.current.getAttribute("aria-expanded") === "true" || false;
        navListRef.current.classList.toggle("active");
        mobileMenuRef.current.classList.toggle("active");
        mobileMenuRef.current.setAttribute("aria-expanded", !isExpanded);
      }
    };

    if (mobileMenuRef.current) {
      mobileMenuRef.current.addEventListener("click", handleClick);
    }

    return () => {
      if (mobileMenuRef.current) {
        mobileMenuRef.current.removeEventListener("click", handleClick);
      }
    };
  }, []);

  // Change logo on screen resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 990) {
        setCurrentLogo(logoMini);
      } else {
        setCurrentLogo(logo);
      }
    };

    // Set initial logo based on window size
    handleResize();

    // Attach the event listener
    window.addEventListener('resize', handleResize);

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <nav>
      <div className="search">
        <input type="input" placeholder="search" required="search"/>
        <label htmlFor="search">search</label>
      </div>
      
      <a className="logo" href="/" aria-label="Page d'accueil">
        <img src={currentLogo} alt="imprimante copieur" />
      </a>

      <div className="mobile-menu" aria-label="Ouvrir le menu" ref={mobileMenuRef}>
        <div className="ligne1"></div>
        <div className="ligne2"></div>
        <div className="ligne3"></div>
      </div>

      <ul className="nav-list" ref={navListRef}>
        <li><Link to="/catalogue"><img src={catalogue} alt="" /></Link></li>
        <li><Link to="/cart"><img src={cart} alt="panier" /></Link></li>
        {isLoggedIn ? (
          <>
            <li><Link to="/account"><img src="utilisateurco" alt=""/></Link></li>
            <li>
              <button onClick={handleLogout} className="btn-logout">
                Déconnexion
              </button>
            </li>
          </>
        ) : (
          <li><Link to="/login"><img src={utilisateur} alt="" /></Link></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
