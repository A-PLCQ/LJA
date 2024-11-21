// cartRoutes.js - Définition des routes pour la gestion du panier

const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const cartController = require('../controllers/cartController');
const router = express.Router();

// Routes pour gérer le panier*

// GET /cart - Récupère tous les éléments du panier
router.get('/', authMiddleware, cartController.getCartItems);

// POST /cart - Ajoute un élément au panier
router.post('/', authMiddleware, cartController.addCartItem);

// PUT /cart/:id - Met à jour les informations d'un élément du panier*
router.put('/:id', authMiddleware, cartController.updateCartItem);

// DELETE /cart/:id - Supprime un élément du panier*
router.delete('/:id', authMiddleware, cartController.deleteCartItem);

// DELETE /cart - Vide le panier*
router.delete('/', authMiddleware, cartController.clearCart);

module.exports = router;
