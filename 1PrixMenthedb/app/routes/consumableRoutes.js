const express = require('express');
const router = express.Router();
const consumableController = require('../controllers/consumableController');
const { validateCreateConsumable, validateUpdateConsumable } = require('../validators/consumableValidator');
const authMiddleware = require('../middlewares/authMiddleware').authMiddleware;
const roleMiddleware = require('../middlewares/roleMiddleware');

// Récupérer tous les consommables (accessible à tous)
router.get('/', consumableController.getAllConsumables);

// Récupérer un consommable par ID (accessible à tous)
router.get('/:id', consumableController.getConsumableById);

// Créer un nouveau consommable (admin et manager)
router.post('/', authMiddleware, roleMiddleware(['admin', 'manager']), validateCreateConsumable, consumableController.createConsumable);

// Mettre à jour un consommable (admin et manager)
router.put('/:id', authMiddleware, roleMiddleware(['admin', 'manager']), validateUpdateConsumable, consumableController.updateConsumable);

// Supprimer un consommable (admin et manager)
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), consumableController.deleteConsumable);

module.exports = router;
