// compatibleRoutes.js - Définition des routes pour les compatibilités

const express = require('express');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');
const compatibleController = require('../controllers/compatibleController');
const router = express.Router();

const adminOrManager = roleMiddleware(['admin', 'manager']);

// Routes pour récupérer les compatibilités consumables
router.get('/consumable/:id', compatibleController.getCompatiblePrintersByConsumable);

// Routes pour récupérer les compatibilités printer
router.get('/printer/:id', compatibleController.getCompatibleConsumablesByPrinter);

// Route pour ajouter une compatibilité
router.post('/', authMiddleware, adminOrManager, compatibleController.addCompatibility);

// Route pour supprimer une compatibilité
router.delete('/:id_printer/:id_consumable', authMiddleware, adminOrManager, compatibleController.deleteCompatibility);

module.exports = router;
