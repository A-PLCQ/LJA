// imageRoutes.js - Définition des routes pour la gestion des images

const express = require('express');
const { authMiddleware, roleMiddleware } = require('../middlewares/authMiddleware');
const imageController = require('../controllers/imageController');

const router = express.Router();

// Middleware de validation des rôles (administrateur ou manager requis pour certaines opérations)
const adminOrManager = roleMiddleware(['admin', 'manager']);

// Route pour récupérer les images d'un produit spécifique (imprimante ou consommable)
router.get('/:type/:brand/:model', imageController.getImagesByProduct);

// Route pour uploader une image (accessible aux utilisateurs authentifiés)
router.post('/upload', authMiddleware, adminOrManager, imageController.uploadImage);

// Route pour ajouter une nouvelle image en base de données (admin ou manager uniquement)
router.post('/', authMiddleware, adminOrManager, imageController.addImage);

// Route pour mettre à jour une image par ID (admin ou manager uniquement)
router.put('/:id', authMiddleware, adminOrManager, imageController.updateImage);

// Route pour supprimer une image spécifique (admin ou manager uniquement)
router.delete('/:type/:brand/:model/:imageName', authMiddleware, adminOrManager, imageController.deleteImage);

module.exports = router;
