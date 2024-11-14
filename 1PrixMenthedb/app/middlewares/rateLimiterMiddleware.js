// authRateLimiter.js - Middleware spécifique à l'authentification pour limiter les tentatives
const rateLimit = require('express-rate-limit');

// Middleware de limitation pour les tentatives d'authentification
const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Fenêtre de 15 minutes
  max: 20, // Limite chaque IP à 20 requêtes par fenêtre pour les actions critiques (connexion, réinitialisation de mot de passe)
  message: 'Trop de tentatives depuis cette adresse IP, veuillez réessayer plus tard.',
  headers: true, // Inclure les en-têtes de limitation
});

module.exports = authRateLimiter;
