// printerRoutes.js - Définition des routes pour la gestion des imprimantes

const express = require('express');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');
const printerController = require('../controllers/printerController');
const router = express.Router();

// Middleware de validation des rôles (administrateur ou manager requis pour certaines opérations)
const adminOrManager = roleMiddleware(['admin', 'manager']);

// Route pour récupérer toutes les imprimantes
router.get('/', printerController.getPrinters);

// Route pour récupérer les détails d'une imprimante par ID
router.get('/:id', printerController.getPrinterById);

// Route pour ajouter une nouvelle imprimante (réservé aux administrateurs et managers)
router.post('/', authMiddleware, adminOrManager, printerController.addPrinter);

// Route pour mettre à jour les informations d'une imprimante (réservé aux administrateurs et managers)
router.put('/:id', authMiddleware, adminOrManager, printerController.updatePrinter);

// Route pour supprimer une imprimante (réservé aux administrateurs et managers)
router.delete('/:id', authMiddleware, adminOrManager, printerController.deletePrinter);

module.exports = router;
