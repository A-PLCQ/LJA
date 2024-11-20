// authRoutes.js - Définition des routes d'authentification

const express = require('express');
const { validationResult } = require('express-validator');
const authController = require('../controllers/authController');
const {
  registerValidator,
  verifyEmailValidator,
  loginValidator,
} = require('../validators/authValidator');

const router = express.Router();

// Middleware pour gérer les erreurs de validation
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Routes d'authentification

// Inscription utilisateur (avec validation)
router.post('/register', registerValidator, validate, authController.registerUser);

// Vérifier l'email d'inscription
router.get('/verify', verifyEmailValidator, validate, authController.verifyEmail);

// Connexion utilisateur (avec limitation des tentatives et validation)
router.post('/login', loginValidator, validate, authController.loginUser);

// Déconnexion utilisateur
router.post('/logout', validate, authController.logoutUser);

// Récupérer un nouveau jeton d'accès et de rafraîchissement
router.post('/refresh-token', validate, authController.refreshAccessToken);

module.exports = router;
