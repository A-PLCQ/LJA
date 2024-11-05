const express = require('express');
const router = express.Router();
const printerController = require('../controllers/printerController');
const { validateCreatePrinter, validateUpdatePrinter } = require('../validators/printerValidator');
const authMiddleware = require('../middlewares/authMiddleware').authMiddleware;
const roleMiddleware = require('../middlewares/roleMiddleware');

// Route pour récupérer toutes les imprimantes (accessible à tous)
router.get('/', printerController.getAllPrinters);

// Route pour récupérer une imprimante par son ID (accessible à tous)
router.get('/:id', printerController.getPrinterById);

// Route pour créer une imprimante (admin et manager)
router.post('/', authMiddleware, roleMiddleware(['admin', 'manager']), validateCreatePrinter, printerController.createPrinter);

// Route pour mettre à jour une imprimante (admin et manager)
router.put('/:id', authMiddleware, roleMiddleware(['admin', 'manager']), validateUpdatePrinter, printerController.updatePrinter);

// Route pour supprimer une imprimante (admin seulement)
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), printerController.deletePrinter);

module.exports = router;
