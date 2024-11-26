import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../services/authService';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await dispatch(login({ email, password }));
            navigate('/'); // Redirection vers la page d'accueil après connexion réussie
        } catch (error) {
            console.error('Erreur de connexion:', error);
            alert('Identifiants incorrects ou problème de connexion.');
        }
    };

    return (
        <div className="login-page">
            <h2>Connexion</h2>
            <form onSubmit={handleLogin}>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Mot de passe</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Se connecter</button>
            </form>
            <p>
                Pas de compte ? <Link to="/register">S'inscrire</Link>
            </p>
        </div>
    );
};

export default LoginPage;
