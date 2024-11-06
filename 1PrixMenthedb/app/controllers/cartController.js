// cartController.js
const db = require('../config/db');
const { NotFoundError, ValidationError } = require('../helpers/customErrors');
const logger = require('../config/logger');
const { validateProductInStock } = require('../services/productService');
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
    `SELECT ci.product_id, ci.quantity, ci.price 
     FROM cart_items ci WHERE ci.cart_id = ?`, [cart[0].id_cart]
  );
  return { cartId: cart[0].id_cart, items };
};

// Ajouter un article au panier
const addItemToCart = [
  validateAddItemToCart, // Application de la validation avant la logique principale
  async (req, res) => {
    const { userId, productId, quantity } = req.body;
    await validateProductInStock(productId, quantity);
    const cart = await getCartByUser(userId);

    const [existingItem] = await db.query(
      `SELECT * FROM cart_items WHERE cart_id = ? AND product_id = ?`, [cart.cartId, productId]
    );

    if (existingItem.length) {
      await db.query(
        `UPDATE cart_items SET quantity = quantity + ? WHERE cart_id = ? AND product_id = ?`,
        [quantity, cart.cartId, productId]
      );
    } else {
      await db.query(
        `INSERT INTO cart_items (cart_id, product_id, quantity, price) 
         VALUES (?, ?, ?, (SELECT price FROM products WHERE id_product = ?))`,
        [cart.cartId, productId, quantity, productId]
      );
    }
    res.json({ message: 'Article ajouté au panier avec succès' });
  }
];

// Mettre à jour la quantité d'un article
const updateCartItem = [
  validateUpdateCartItem, // Application de la validation
  async (req, res) => {
    const { userId, productId, quantity } = req.body;
    await validateProductInStock(productId, quantity);
    const cart = await getCartByUser(userId);

    const [result] = await db.query(
      `UPDATE cart_items SET quantity = ? WHERE cart_id = ? AND product_id = ?`,
      [quantity, cart.cartId, productId]
    );

    if (result.affectedRows === 0) throw new NotFoundError('Article non trouvé dans le panier');
    res.json({ message: 'Quantité mise à jour avec succès' });
  }
];

// Supprimer un article du panier
const removeItemFromCart = [
  validateRemoveItemFromCart, // Application de la validation
  async (req, res) => {
    const { userId, productId } = req.body;
    const cart = await getCartByUser(userId);

    const [result] = await db.query(
      `DELETE FROM cart_items WHERE cart_id = ? AND product_id = ?`,
      [cart.cartId, productId]
    );

    if (result.affectedRows === 0) throw new NotFoundError('Article non trouvé dans le panier');
    res.json({ message: 'Article supprimé du panier' });
  }
];

const clearCart = async (userId) => {
  const cart = await getCartByUser(userId);

  await db.query(`DELETE FROM cart_items WHERE cart_id = ?`, [cart.cartId]);
  return { message: 'Panier vidé avec succès' };
};

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
      `INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)`,
      [order.insertId, item.product_id, item.quantity, item.price]
    );
  }

  await db.query(`UPDATE carts SET status = 'checked_out' WHERE id_cart = ?`, [cart.cartId]);
  
  await db.query('COMMIT');

  return { message: 'Commande créée avec succès', orderId: order.insertId };
};

module.exports = {
  getCartByUser,
  addItemToCart,
  updateCartItem,
  removeItemFromCart,
  clearCart,
  checkoutCart,
};
