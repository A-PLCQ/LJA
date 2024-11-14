// userRoutes.js - Définition des routes utilisateur

const express = require('express');
const { body, validationResult } = require('express-validator');
const userController = require('../controllers/userController');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');
const authRateLimiter = require('../middlewares/rateLimiterMiddleware'); // Importer le rate limiter spécifique à l'authentification
const { userValidator, loginValidator, passwordChangeValidator, updateUserProfileValidator } = require('../validators/userValidator');

const router = express.Router();

// Middleware de validation des champs (utilisé après chaque validator)
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Inscription utilisateur avec validation
router.post('/register', userValidator, validate, userController.registerUser);

// Verification de l'email d'inscription
router.get('/verify', userController.verifyEmail);

// Connexion utilisateur (avec limitation des tentatives et validation)
router.post('/login', authRateLimiter, loginValidator, validate, userController.loginUser);

// Déconnexion utilisateur
router.post('/logout', authMiddleware, userController.logoutUser);

// Obtenir le profil de l'utilisateur (doit être authentifié)
router.get('/profile', authMiddleware, userController.getUserProfile);

// Mettre à jour le profil utilisateur avec validation de l'email (doit être authentifié)
router.put('/profile', authMiddleware, updateUserProfileValidator, validate, userController.updateUserProfile);

// Supprimer un utilisateur (doit être authentifié et réservé aux administrateurs)
router.delete('/delete', authMiddleware, userController.deleteUser);

// Demander la réinitialisation du mot de passe (limité en requêtes)
router.post('/password-reset/request', authRateLimiter, userController.requestPasswordReset);

// Réinitialiser le mot de passe avec validation
router.post('/password-reset/reset', passwordChangeValidator, validate, userController.resetPassword);

module.exports = router;
