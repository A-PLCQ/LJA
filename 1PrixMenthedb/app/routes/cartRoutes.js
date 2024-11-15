// cartRoutes.js - Définition des routes pour la gestion du panier

const express = require('express');
const { authMiddleware } = require('../middlewares/authMiddleware');
const cartController = require('../controllers/cartController');
const router = express.Router();

// Routes pour gérer le panier
router.get('/', authMiddleware, cartController.getCartItems);
router.post('/', authMiddleware, cartController.addCartItem);
router.put('/:id', authMiddleware, cartController.updateCartItem);
router.delete('/:id', authMiddleware, cartController.deleteCartItem);
router.delete('/', authMiddleware, cartController.clearCart);

module.exports = router;
