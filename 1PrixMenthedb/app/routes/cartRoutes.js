const express = require('express');
const cartController = require('../controllers/cartController');
const { validateAddItemToCart, validateUpdateCartItem, validateRemoveItemFromCart } = require('../validators/cartValidator');
const authMiddleware = require('../middlewares/authMiddleware').authMiddleware;
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

// Routes pour l'utilisateur connecté

// Récupérer le panier de l'utilisateur connecté
router.get('/', authMiddleware, cartController.getCartByUser);

// Ajouter un article au panier de l'utilisateur connecté
router.post('/add', authMiddleware, validateAddItemToCart, cartController.addItemToCart);

// Mettre à jour la quantité d'un article dans le panier de l'utilisateur connecté
router.put('/update/:productId', authMiddleware, validateUpdateCartItem, cartController.updateCartItem);

// Supprimer un article spécifique du panier de l'utilisateur connecté
router.delete('/remove/:productId', authMiddleware, validateRemoveItemFromCart, cartController.removeItemFromCart);

// Vider complètement le panier de l'utilisateur connecté
router.delete('/clear', authMiddleware, cartController.clearCart);

// Finaliser le panier de l'utilisateur connecté et créer une commande
router.post('/checkout', authMiddleware, cartController.checkoutCart);


// Routes pour l'admin et le manager pour gérer les paniers des utilisateurs

// Visualiser le panier d'un utilisateur spécifique (admin/manager uniquement)
router.get('/user/:userId', authMiddleware, roleMiddleware(['admin', 'manager']), cartController.viewCartByAdmin);

// Supprimer un article spécifique du panier d'un utilisateur (admin uniquement)
router.delete('/user/:userId/item', authMiddleware, roleMiddleware(['admin']), cartController.adminRemoveItemFromCart);

// Vider complètement le panier d'un utilisateur spécifique (admin uniquement)
router.delete('/user/:userId/clear', authMiddleware, roleMiddleware(['admin']), cartController.adminClearCart);

// Mettre à jour la quantité d'un article dans le panier d'un utilisateur spécifique (admin uniquement)
router.put('/user/:userId/item', authMiddleware, roleMiddleware(['admin']), cartController.adminUpdateCartItem);

module.exports = router;
