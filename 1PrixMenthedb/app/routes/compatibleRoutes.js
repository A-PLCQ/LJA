const express = require('express');
const router = express.Router();
const compatibleController = require('../controllers/compatibleController');
const authMiddleware = require('../middlewares/authMiddleware').authMiddleware;
const roleMiddleware = require('../middlewares/roleMiddleware');

// Route pour récupérer les consommables compatibles pour une imprimante
router.get('/printer/:printerId/consumables', compatibleController.getCompatibleConsumables);

// Route pour récupérer les imprimantes compatibles pour un consommable
router.get('/consumable/:consumableId/printers', compatibleController.getCompatiblePrinters);

// Route pour ajouter une compatibilité entre une imprimante et un consommable (admin et manager)
router.post('/', authMiddleware, roleMiddleware(['admin', 'manager']), compatibleController.addCompatibility);

// Route pour supprimer une compatibilité entre une imprimante et un consommable (admin et manager)
router.delete('/', authMiddleware, roleMiddleware(['admin', 'manager']), compatibleController.removeCompatibility);

module.exports = router;
