import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/authService';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nom: '',
    prenom: '',
    telephone: '',
    adresse: '',
    siret: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      alert('Inscription réussie, vous pouvez maintenant vous connecter.');
      navigate('/login'); // Redirection vers la page de connexion
    } catch (error) {
      console.error('Erreur lors de l’inscription:', error);
      alert("Erreur lors de l'inscription. Veuillez vérifier vos informations.");
    }
  };

  return (
    <div className="register-page">
      <h2>Créer un compte</h2>
      <form onSubmit={handleRegister}>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Mot de passe</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Nom</label>
          <input
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Prénom</label>
          <input
            type="text"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Téléphone</label>
          <input
            type="text"
            name="telephone"
            value={formData.telephone}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Adresse</label>
          <input
            type="text"
            name="adresse"
            value={formData.adresse}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>SIRET</label>
          <input
            type="text"
            name="siret"
            value={formData.siret}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">S'inscrire</button>
      </form>
      <p>
        Déjà un compte ? <Link to="/login">Connexion</Link>
      </p>
    </div>
  );
};

export default RegisterPage;
