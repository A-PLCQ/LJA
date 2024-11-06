const express = require('express');
const cartController = require('../controllers/cartController');
const { validateAddItemToCart, validateUpdateCartItem, validateRemoveItemFromCart } = require('../validators/cartValidator');
const authMiddleware = require('../middlewares/authMiddleware').authMiddleware;

const router = express.Router();

// Route pour récupérer le panier de l'utilisateur connecté
router.get('/', authMiddleware, cartController.getCartByUser);

// Route pour ajouter un article au panier (authentification requise)
router.post('/add', authMiddleware, validateAddItemToCart, cartController.addItemToCart);

// Route pour mettre à jour la quantité d'un article dans le panier
router.put('/update/:productId', authMiddleware, validateUpdateCartItem, cartController.updateCartItem);

// Route pour supprimer un article du panier
router.delete('/remove/:productId', authMiddleware, validateRemoveItemFromCart, cartController.removeItemFromCart);

// Route pour vider le panier de l'utilisateur
router.delete('/clear', authMiddleware, cartController.clearCart);

// Route pour finaliser le panier et créer une commande
router.post('/checkout', authMiddleware, cartController.checkoutCart);

module.exports = router;
