const express = require('express');
const router = express.Router();
const compatibleController = require('../controllers/compatibleController');
const authMiddleware = require('../middlewares/authMiddleware').authMiddleware;
const adminMiddleware = require('../middlewares/adminMiddleware');

// Route pour récupérer les consommables compatibles pour une imprimante
router.get('/printer/:printerId/consumables', compatibleController.getCompatibleConsumables);

// Route pour récupérer les imprimantes compatibles pour un consommable
router.get('/consumable/:consumableId/printers', compatibleController.getCompatiblePrinters);

// Route pour ajouter une compatibilité entre une imprimante et un consommable (requiert l'authentification admin)
router.post('/', authMiddleware, adminMiddleware, compatibleController.addCompatibility);

// Route pour supprimer une compatibilité entre une imprimante et un consommable (requiert l'authentification admin)
router.delete('/', authMiddleware, adminMiddleware, compatibleController.removeCompatibility);

module.exports = router;
