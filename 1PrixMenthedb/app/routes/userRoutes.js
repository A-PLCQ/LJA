const express = require('express');
const userController = require('../controllers/userController');
const { validateCreateUser, validateLoginUser, validateUpdateUserProfile, validatePasswordReset, validateResetPasswordConfirmation } = require('../validators/userValidator');
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
router.put('/profile', authMiddleware, validateUpdateUserProfile, userController.updateUserProfile);

// Route pour supprimer le compte utilisateur (authentification requise)
router.delete('/profile', authMiddleware, userController.deleteUser);

// Route pour demander un code de réinitialisation de mot de passe (protégée par rate limit)
router.post('/password-reset', rateLimiterMiddleware, validatePasswordReset, userController.requestPasswordReset);

// Route pour confirmer la réinitialisation du mot de passe
router.post('/password-reset/confirm', rateLimiterMiddleware, validateResetPasswordConfirmation, userController.resetPassword);

// Routes administrateur
router.get('/admin/users', authMiddleware, roleMiddleware(['admin', 'manager']), userController.getAllUsers); // Récupérer tous les utilisateurs
router.get('/admin/users/:id', authMiddleware, roleMiddleware(['admin', 'manager']), userController.getUserById); // Récupérer un utilisateur par ID
router.delete('/admin/users/:id', authMiddleware, roleMiddleware(['admin']), userController.deleteUserById); // Supprimer un utilisateur par ID
router.put('/admin/users/:id/role', authMiddleware, roleMiddleware(['admin']), userController.updateUserRole); // Modifier le rôle d'un utilisateur

module.exports = router;
