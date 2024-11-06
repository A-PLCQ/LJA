// cartValidator.js
const { body, param, validationResult } = require('express-validator');

// Validation pour l'ajout d'un article au panier
const validateAddItemToCart = [
  body('productId')
    .isInt({ min: 1 }).withMessage('L\'ID du produit doit être un entier positif.')
    .toInt(),
  body('quantity')
    .isInt({ min: 1 }).withMessage('La quantité doit être un entier positif.')
    .toInt(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Validation pour la mise à jour d'un article dans le panier
const validateUpdateCartItem = [
  param('productId')
    .isInt({ min: 1 }).withMessage('L\'ID du produit doit être un entier positif.')
    .toInt(),
  body('quantity')
    .isInt({ min: 1 }).withMessage('La quantité doit être un entier positif.')
    .toInt(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Validation pour supprimer un article du panier
const validateRemoveItemFromCart = [
  param('productId')
    .isInt({ min: 1 }).withMessage('L\'ID du produit doit être un entier positif.')
    .toInt(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

// Exporter les validations
module.exports = {
  validateAddItemToCart,
  validateUpdateCartItem,
  validateRemoveItemFromCart,
};
