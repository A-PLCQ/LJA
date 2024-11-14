// authRoutes.js - Définition des routes d'authentification

const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Route pour rafraîchir le token d'accès
router.post('/refresh-token', authController.refreshAccessToken);

module.exports = router;
