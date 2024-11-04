// imageRoutes.js

const express = require('express');
const router = express.Router();
const imageController = require('../controllers/imageController');

// Route pour uploader une image
router.post('/upload', imageController.uploadImage);

// Route pour récupérer les images d'un modèle
router.get('/:type/:brand/:model', imageController.getImages);

// Route pour supprimer une image spécifique
router.delete('/:type/:brand/:model/:imageName', imageController.deleteImage);

module.exports = router;
