// cartController.js
const db = require('../config/db');
const { NotFoundError, ValidationError } = require('../helpers/customErrors');
const logger = require('../config/logger');
const printerService = require('../services/printerService');
const consumableService = require('../services/consumableService');
const { validateAddItemToCart, validateUpdateCartItem, validateRemoveItemFromCart } = require('../validators/cartValidator');

// Récupérer le panier actif d'un utilisateur
const getCartByUser = async (userId) => {
  const [cart] = await db.query(
    `SELECT * FROM carts WHERE user_id = ? AND status = 'active'`, [userId]
  );
  if (!cart.length) {
    const [newCart] = await db.query(
      `INSERT INTO carts (user_id, status) VALUES (?, 'active')`, [userId]
    );
    return { cartId: newCart.insertId, items: [] };
  }
  const [items] = await db.query(
    `SELECT ci.product_id, ci.quantity, ci.price, ci.type 
     FROM cart_items ci WHERE ci.cart_id = ?`, [cart[0].id_cart]
  );
  return { cartId: cart[0].id_cart, items };
};

// Fonction utilitaire pour valider le stock selon le type de produit
const validateStockByType = async (productId, quantity, type) => {
  if (type === 'printer') {
    await printerService.validatePrinterInStock(productId, quantity);
  } else if (type === 'consumable') {
    await consumableService.validateConsumableInStock(productId, quantity);
  } else {
    throw new ValidationError('Type de produit invalide');
  }
};

// Ajouter un article au panier
const addItemToCart = [
  validateAddItemToCart,
  async (req, res) => {
    const { userId, productId, quantity, type } = req.body;
    await validateStockByType(productId, quantity, type);

    const cart = await getCartByUser(userId);

    const [existingItem] = await db.query(
      `SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ? AND type = ?`,
      [cart.cartId, productId, type]
    );

    if (existingItem.length) {
      await db.query(
        `UPDATE cart_items SET quantity = quantity + ? WHERE cart_id = ? AND product_id = ? AND type = ?`,
        [quantity, cart.cartId, productId, type]
      );
    } else {
      const price = type === 'printer' ? 
        await printerService.getPrinterPriceById(productId) :
        await consumableService.getConsumablePriceById(productId);
      
      await db.query(
        `INSERT INTO cart_items (cart_id, product_id, quantity, price, type) 
         VALUES (?, ?, ?, ?, ?)`,
        [cart.cartId, productId, quantity, price, type]
      );
    }
    res.json({ message: 'Article ajouté au panier avec succès' });
  }
];

// Mettre à jour la quantité d'un article
const updateCartItem = [
  validateUpdateCartItem,
  async (req, res) => {
    const { userId, productId, quantity, type } = req.body;
    await validateStockByType(productId, quantity, type);

    const cart = await getCartByUser(userId);

    const [result] = await db.query(
      `UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND product_id = ? AND type = ?`,
      [quantity, cart.cartId, productId, type]
    );

    if (result.affectedRows === 0) throw new NotFoundError('Article non trouvé dans le panier');
    res.json({ message: 'Quantité mise à jour avec succès' });
  }
];

// Supprimer un article du panier
const removeItemFromCart = [
  validateRemoveItemFromCart,
  async (req, res) => {
    const { userId, productId, type } = req.body;
    const cart = await getCartByUser(userId);

    const [result] = await db.query(
      `DELETE FROM cart_items WHERE cart_id = ? AND product_id = ? AND type = ?`,
      [cart.cartId, productId, type]
    );

    if (result.affectedRows === 0) throw new NotFoundError('Article non trouvé dans le panier');
    res.json({ message: 'Article supprimé du panier' });
  }
];

// Vider le panier
const clearCart = async (userId) => {
  const cart = await getCartByUser(userId);

  await db.query(`DELETE FROM cart_items WHERE cart_id = ?`, [cart.cartId]);
  return { message: 'Panier vidé avec succès' };
};

// Valider le panier pour créer une commande
const checkoutCart = async (userId) => {
  const cart = await getCartByUser(userId);
  
  await db.query('START TRANSACTION');

  const [order] = await db.query(
    `INSERT INTO orders (user_id, order_date, status) VALUES (?, NOW(), 'pending')`,
    [userId]
  );

  const [items] = await db.query(`SELECT * FROM cart_items WHERE cart_id = ?`, [cart.cartId]);
  for (let item of items) {
    await db.query(
      `INSERT INTO order_items (order_id, product_id, quantity, price, type) VALUES (?, ?, ?, ?, ?)`,
      [order.insertId, item.product_id, item.quantity, item.price, item.type]
    );
  }

  await db.query(`UPDATE carts SET status = 'checked_out' WHERE id_cart = ?`, [cart.cartId]);
  
  await db.query('COMMIT');

  return { message: 'Commande créée avec succès', orderId: order.insertId };
};

// Visualiser le panier d'un utilisateur (admin/manager)
const viewCartByAdmin = async (req, res) => {
  const { userId } = req.params;
  try {
    const cart = await getCartByUser(userId);
    res.json(cart);
  } catch (error) {
    logger.error(`Erreur lors de la récupération du panier : ${error.message}`);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Supprimer un article du panier d'un utilisateur (admin/manager)
const adminRemoveItemFromCart = async (req, res) => {
  const { userId } = req.params;
  const { productId, type } = req.body;

  try {
    const cart = await getCartByUser(userId);

    const [result] = await db.query(
      `DELETE FROM cart_items WHERE cart_id = ? AND product_id = ? AND type = ?`,
      [cart.cartId, productId, type]
    );

    if (result.affectedRows === 0) throw new NotFoundError('Article non trouvé dans le panier');
    res.json({ message: "Article supprimé du panier de l'utilisateur avec succès" });
  } catch (error) {
    logger.error(`Erreur lors de la suppression de l'article dans le panier : ${error.message}`);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Vider le panier d'un utilisateur (admin/manager)
const adminClearCart = async (req, res) => {
  const { userId } = req.params;

  try {
    const cart = await getCartByUser(userId);

    await db.query(`DELETE FROM cart_items WHERE cart_id = ?`, [cart.cartId]);
    res.json({ message: "Panier de l'utilisateur vidé avec succès" });
  } catch (error) {
    logger.error(`Erreur lors du vidage du panier de l'utilisateur : ${error.message}`);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Modifier la quantité d'un article dans le panier d'un utilisateur (admin/manager)
const adminUpdateCartItem = async (req, res) => {
  const { userId } = req.params;
  const { productId, quantity, type } = req.body;

  try {
    await validateStockByType(productId, quantity, type);

    const cart = await getCartByUser(userId);

    const [result] = await db.query(
      `UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND product_id = ? AND type = ?`,
      [quantity, cart.cartId, productId, type]
    );

    if (result.affectedRows === 0) throw new NotFoundError('Article non trouvé dans le panier');
    res.json({ message: "Quantité de l'article mise à jour avec succès dans le panier de l'utilisateur" });
  } catch (error) {
    logger.error(`Erreur lors de la mise à jour de la quantité dans le panier : ${error.message}`);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

module.exports = {
  getCartByUser,
  addItemToCart,
  updateCartItem,
  removeItemFromCart,
  clearCart,
  checkoutCart,
  viewCartByAdmin,
  adminRemoveItemFromCart,
  adminClearCart,
  adminUpdateCartItem,
};
