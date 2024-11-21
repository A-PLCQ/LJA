// adminRoutes.js - Définition des routes administrateur pour la gestion des utilisateurs

const express = require('express');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');
const userControllerAdmin = require('../controllersAdmin/userControllerAdmin');

const router = express.Router();

// Middleware de validation des rôles
const adminOnly = roleMiddleware(['admin']);
const managerOrAdmin = roleMiddleware(['manager', 'admin']);

// Récupérer tous les utilisateurs (réservé aux managers et administrateurs)
router.get('/users', authMiddleware, managerOrAdmin, userControllerAdmin.getAllUsers);

// Récupérer les informations d’un utilisateur par ID (réservé aux managers et administrateurs)
router.get('/users/:id', authMiddleware, managerOrAdmin, userControllerAdmin.getUserById);

// Modifier le rôle d’un utilisateur (réservé aux administrateurs)
router.put('/users/:id/role', authMiddleware, adminOnly, userControllerAdmin.updateUserRole);

// Supprimer un utilisateur par ID (réservé aux administrateurs)
router.delete('/users/:id', authMiddleware, adminOnly, userControllerAdmin.deleteUserById);

module.exports = router;
