// consumableRoutes.js - Définition des routes pour la gestion des consommables

const express = require('express');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');
const consumableController = require('../controllers/consumableController');
const router = express.Router();

// Middleware de validation des rôles (administrateur ou manager requis pour certaines opérations)
const adminOrManager = roleMiddleware(['admin', 'manager']);

// Route pour récupérer tous les consommables
router.get('/', consumableController.getConsumables);

// Route pour récupérer les détails d'un consommable par ID
router.get('/:id', consumableController.getConsumableById);

// Route pour ajouter un nouveau consommable (réservé aux administrateurs et managers)
router.post('/', authMiddleware, adminOrManager, consumableController.addConsumable);

// Route pour mettre à jour les informations d'un consommable (réservé aux administrateurs et managers)
router.put('/:id', authMiddleware, adminOrManager, consumableController.updateConsumable);

// Route pour supprimer un consommable (réservé aux administrateurs et managers)
router.delete('/:id', authMiddleware, adminOrManager, consumableController.deleteConsumable);

module.exports = router;
