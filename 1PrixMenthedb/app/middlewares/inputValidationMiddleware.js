// inputValidationMiddleware.js - Middleware for validating user input

const { body, validationResult } = require('express-validator');

// Middleware for validating user signup input
const validateSignup = [
  body('nom').isString().isLength({ min: 2 }).withMessage('Le nom doit contenir au moins 2 caractères.'),
  body('prenom').isString().isLength({ min: 2 }).withMessage('Le prénom doit contenir au moins 2 caractères.'),
  body('email').isEmail().withMessage('Veuillez entrer un email valide.'),
  body('mot_de_passe').isLength({ min: 8 }).withMessage('Le mot de passe doit contenir au moins 8 caractères.'),
  body('adresse').isString().notEmpty().withMessage("L'adresse est obligatoire."),
  body('telephone').isString().isLength({ min: 10 }).withMessage('Le numéro de téléphone doit contenir au moins 10 caractères.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

module.exports = {
  validateSignup,
};
