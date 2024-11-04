const express = require('express');
const userController = require('../controllers/userController'); // Importation du contrôleur utilisateur complet
const { validateCreateUser, validateLoginUser } = require('../validators/userValidator');
const authMiddleware = require('../middlewares/authMiddleware').authMiddleware;
const adminMiddleware = require('../middlewares/adminMiddleware');
const rateLimiterMiddleware = require('../middlewares/rateLimiterMiddleware');

const router = express.Router();

// Route pour l'inscription de l'utilisateur avec validation de l'email
router.post('/register', validateCreateUser, userController.registerUser);

// Route pour la connexion de l'utilisateur
router.post('/login', validateLoginUser, userController.loginUser);

// Route pour la récupération du profil utilisateur (nécessite une authentification)
router.get('/profile', authMiddleware, userController.getUserProfile);

// Route pour la mise à jour du profil utilisateur (nécessite une authentification)
router.put('/profile', authMiddleware, userController.updateUserProfile);

// Route pour la suppression du compte utilisateur (nécessite une authentification)
router.delete('/profile', authMiddleware, userController.deleteUser);

// Route pour demander un code de réinitialisation de mot de passe (protégé par rate limit)
router.post('/password-reset', rateLimiterMiddleware, userController.requestPasswordReset);

// Route pour réinitialiser le mot de passe avec le code de validation (protégé par rate limit)
router.post('/password-reset/confirm', rateLimiterMiddleware, userController.resetPassword);

// Route d'exemple pour les administrateurs : accès à tous les utilisateurs (nécessite le rôle administrateur)
router.get('/admin/users', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const [users] = await db.query('SELECT id_utilisateur, nom, email FROM users');
    res.json(users);
  } catch (error) {
    logger.error(`Erreur lors de la récupération des utilisateurs: ${error.message}`);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;