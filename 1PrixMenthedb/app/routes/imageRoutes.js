const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');
const authMiddleware = require('../middlewares/authMiddleware').authMiddleware;
const roleMiddleware = require('../middlewares/roleMiddleware');

// Route pour uploader une image (admin et manager)
router.post('/upload', authMiddleware, roleMiddleware(['admin', 'manager']), imageController.uploadImage);

// Route pour récupérer les images d'un modèle (accessible à tous)
router.get('/:type/:brand/:model', imageController.getImages);

// Route pour supprimer une image (admin seulement)
router.delete('/:type/:brand/:model/:imageName', authMiddleware, roleMiddleware(['admin']), imageController.deleteImage);

module.exports = router;
