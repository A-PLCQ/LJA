const express = require('express');
const userController = require('../controllers/userController');
const { validateCreateUser, validateLoginUser, validatePasswordReset, validateResetPasswordConfirmation } = require('../validators/userValidator');
const authMiddleware = require('../middlewares/authMiddleware').authMiddleware;
const roleMiddleware = require('../middlewares/roleMiddleware');
const rateLimiterMiddleware = require('../middlewares/rateLimiterMiddleware');

const router = express.Router();

// Route pour l'inscription (tous)
router.post('/register', validateCreateUser, userController.registerUser);

// Route pour la connexion (tous)
router.post('/login', validateLoginUser, userController.loginUser);

// Route pour le profil utilisateur (authentification requise)
router.get('/profile', authMiddleware, userController.getUserProfile);

// Route pour mettre à jour le profil utilisateur (authentification requise)
router.put('/profile', authMiddleware, validateCreateUser, userController.updateUserProfile);

// Route pour supprimer le compte utilisateur (authentification requise)
router.delete('/profile', authMiddleware, userController.deleteUser);

// Route pour demander un code de réinitialisation de mot de passe (protégée par rate limit)
router.post('/password-reset', rateLimiterMiddleware, validatePasswordReset, userController.requestPasswordReset);

// Route pour confirmer la réinitialisation du mot de passe
router.post('/password-reset/confirm', rateLimiterMiddleware, validateResetPasswordConfirmation, userController.resetPassword);

// Route d'administration pour récupérer tous les utilisateurs (admin seulement)
router.get('/admin/users', authMiddleware, roleMiddleware(['admin']), userController.getAllUsers);

module.exports = router;
