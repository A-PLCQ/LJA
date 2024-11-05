const express = require('express');
const router = express.Router();
const printerController = require('../controllers/printerController');
const { validateCreatePrinter, validateUpdatePrinter } = require('../validators/printerValidator');
const authMiddleware = require('../middlewares/authMiddleware').authMiddleware;
const adminMiddleware = require('../middlewares/adminMiddleware');

// Route pour récupérer toutes les imprimantes (accessible à tous)
router.get('/', printerController.getAllPrinters);

// Route pour récupérer une imprimante par son ID (accessible à tous)
router.get('/:id', printerController.getPrinterById);

// Route pour créer une nouvelle imprimante (accès restreint aux admins)
router.post('/', authMiddleware, adminMiddleware, validateCreatePrinter, printerController.createPrinter);

// Route pour mettre à jour une imprimante par ID (accès restreint aux admins)
router.put('/:id', authMiddleware, adminMiddleware, validateUpdatePrinter, printerController.updatePrinter);

// Route pour supprimer une imprimante par ID (accès restreint aux admins)
router.delete('/:id', authMiddleware, adminMiddleware, printerController.deletePrinter);

module.exports = router;
