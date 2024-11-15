// cartController.js - Gestion des articles dans le panier

const { CartItems, Printers, Consumables, Users } = require('../models');
const logger = require('../config/logger');
const { HTTP_STATUS } = require('../config/constants');

// Récupérer les articles du panier d'un utilisateur
const getCartItems = async (req, res) => {
  try {
    const userId = req.user.id;

    const cartItems = await CartItems.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Printers,
          as: 'printer',
          attributes: ['id_printer', 'brand', 'model', 'price'],
        },
        {
          model: Consumables,
          as: 'consumable',
          attributes: ['id_consumable', 'brand', 'model', 'price'],
        },
      ],
    });

    res.status(HTTP_STATUS.OK).json(cartItems);
  } catch (error) {
    logger.error(`Erreur lors de la récupération des articles du panier : ${error.message}`);
    res.status(HTTP_STATUS.SERVER_ERROR).json({ message: 'Erreur serveur' });
  }
};

// Ajouter un article au panier
const addCartItem = async (req, res) => {
  const { id_printer, id_consumable, quantity } = req.body;
  const userId = req.user.id;

  try {
    if (!id_printer && !id_consumable) {
      return res.status(400).json({ message: 'Un ID d\'imprimante ou de consommable est requis.' });
    }

    const newCartItem = await CartItems.create({
      user_id: userId,
      id_printer,
      id_consumable,
      quantity,
    });

    res.status(HTTP_STATUS.CREATED).json({ message: 'Article ajouté au panier avec succès', cartItem: newCartItem });
  } catch (error) {
    logger.error(`Erreur lors de l'ajout d'un article au panier : ${error.message}`);
    res.status(HTTP_STATUS.SERVER_ERROR).json({ message: 'Erreur serveur' });
  }
};

// Mettre à jour un article du panier
const updateCartItem = async (req, res) => {
  const { id } = req.params;
  const { quantity } = req.body;

  try {
    const cartItem = await CartItems.findByPk(id);
    if (!cartItem) {
      return res.status(404).json({ message: 'Article non trouvé dans le panier' });
    }

    cartItem.quantity = quantity !== undefined ? quantity : cartItem.quantity;
    await cartItem.save();

    res.status(HTTP_STATUS.OK).json({ message: 'Article du panier mis à jour avec succès', cartItem });
  } catch (error) {
    logger.error(`Erreur lors de la mise à jour de l'article du panier : ${error.message}`);
    res.status(HTTP_STATUS.SERVER_ERROR).json({ message: 'Erreur serveur' });
  }
};

// Supprimer un article du panier
const deleteCartItem = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await CartItems.destroy({ where: { id_cart_item: id } });

    if (result === 0) {
      return res.status(404).json({ message: 'Article non trouvé dans le panier' });
    }

    res.status(HTTP_STATUS.OK).json({ message: 'Article supprimé du panier avec succès' });
  } catch (error) {
    logger.error(`Erreur lors de la suppression de l'article du panier : ${error.message}`);
    res.status(HTTP_STATUS.SERVER_ERROR).json({ message: 'Erreur serveur' });
  }
};

// Vider le panier d'un utilisateur
const clearCart = async (req, res) => {
  const userId = req.user.id;

  try {
    await CartItems.destroy({ where: { user_id: userId } });

    res.status(HTTP_STATUS.OK).json({ message: 'Panier vidé avec succès' });
  } catch (error) {
    logger.error(`Erreur lors du vidage du panier : ${error.message}`);
    res.status(HTTP_STATUS.SERVER_ERROR).json({ message: 'Erreur serveur' });
  }
};

module.exports = {
  getCartItems,
  addCartItem,
  updateCartItem,
  deleteCartItem,
  clearCart,
};
