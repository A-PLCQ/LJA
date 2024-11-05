const express = require('express');
const router = express.Router();
const consumableController = require('../controllers/consumableController');
const { validateCreateConsumable, validateUpdateConsumable } = require('../validators/consumableValidator');
const authMiddleware = require('../middlewares/authMiddleware').authMiddleware;
const adminMiddleware = require('../middlewares/adminMiddleware');

// Récupérer tous les consommables
router.get('/', consumableController.getAllConsumables);

// Récupérer un consommable par ID avec imprimantes compatibles
router.get('/:id', consumableController.getConsumableById);

// Créer un nouveau consommable (accès administrateur requis)
router.post('/', authMiddleware, adminMiddleware, validateCreateConsumable, consumableController.createConsumable);

// Mettre à jour un consommable (accès administrateur requis)
router.put('/:id', authMiddleware, adminMiddleware, validateUpdateConsumable, consumableController.updateConsumable);

// Supprimer un consommable (accès administrateur requis)
router.delete('/:id', authMiddleware, adminMiddleware, consumableController.deleteConsumable);

module.exports = router;
