const { body, validationResult } = require('express-validator');

// Validation pour créer une nouvelle imprimante
const validateCreatePrinter = [
  body('brand').isString().withMessage('La marque est obligatoire').isLength({ min: 1 }).withMessage('La marque doit contenir au moins un caractère.'),
  body('model').isString().withMessage('Le modèle est obligatoire').isLength({ min: 1 }).withMessage('Le modèle doit contenir au moins un caractère.'),
  body('reference').isString().withMessage('La référence est obligatoire').isLength({ min: 1 }).withMessage('La référence doit contenir au moins un caractère.'),
  body('price').isFloat({ min: 0.01 }).withMessage('Le prix doit être un nombre positif.'),
  body('weight_kg').isFloat({ min: 0 }).withMessage('Le poids doit être un nombre positif.'),
  body('stock').isInt({ min: 0 }).withMessage('Le stock doit être un entier positif.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Validation pour la mise à jour d'une imprimante
const validateUpdatePrinter = [
  body('brand').optional().isString().withMessage('La marque doit être une chaîne de caractères'),
  body('model').optional().isString().withMessage('Le modèle doit être une chaîne de caractères'),
  body('reference').optional().isString().withMessage('La référence doit être une chaîne de caractères'),
  body('price').optional().isFloat({ min: 0.01 }).withMessage('Le prix doit être un nombre positif'),
  body('weight_kg').optional().isFloat({ min: 0 }).withMessage('Le poids doit être un nombre positif'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Le stock doit être un entier positif'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = {
  validateCreatePrinter,
  validateUpdatePrinter,
};
