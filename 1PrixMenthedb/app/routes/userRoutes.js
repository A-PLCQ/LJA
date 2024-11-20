// userRoutes.js

const express = require('express');
const { validationResult } = require('express-validator');
const userController = require('../controllers/userController');
const { authMiddleware } = require('../middlewares/authMiddleware');
const {
  updateUserProfileValidator,
  deleteUserValidator,
  requestPasswordResetValidator,
  resetPasswordValidator
} = require('../validators/userValidator');

const router = express.Router();

// Middleware pour gérer les erreurs de validation
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Obtenir le profil de l'utilisateur (aucune validation nécessaire ici)
router.get('/profile', authMiddleware, userController.getUserProfile);

// Mettre à jour le profil utilisateur
router.put('/profile', authMiddleware, updateUserProfileValidator, validate, userController.updateUserProfile);

// Supprimer un utilisateur
router.delete('/delete', authMiddleware, deleteUserValidator, validate, userController.deleteUser);

// Demander la réinitialisation du mot de passe
router.post('/password-reset/request', requestPasswordResetValidator, validate, userController.requestPasswordReset);

// Réinitialiser le mot de passe
router.post('/password-reset/reset', resetPasswordValidator, validate, userController.resetPassword);

module.exports = router;
