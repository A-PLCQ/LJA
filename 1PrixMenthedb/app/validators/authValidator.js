// authValidator.js - Validation des champs pour les routes d'authentification

const { body, query } = require('express-validator');

// Validation pour l'inscription (registerUser)
const registerValidator = [
  body('email')
    .notEmpty().withMessage('L\'email est obligatoire.')
    .isEmail().withMessage('L\'email doit être valide.'),

  body('mot_de_passe')
    .notEmpty().withMessage('Le mot de passe est obligatoire.')
    .isLength({ min: 8 }).withMessage('Le mot de passe doit contenir au moins 8 caractères.')
    .matches(/[A-Z]/).withMessage('Le mot de passe doit contenir au moins une lettre majuscule.')
    .matches(/[a-z]/).withMessage('Le mot de passe doit contenir au moins une lettre minuscule.')
    .matches(/[0-9]/).withMessage('Le mot de passe doit contenir au moins un chiffre.')
    .matches(/[\W_]/).withMessage('Le mot de passe doit contenir au moins un caractère spécial.'),

  body('nom')
    .notEmpty().withMessage('Le nom est obligatoire.')
    .isString().withMessage('Le nom doit être une chaîne de caractères.')
    .isLength({ min: 2 }).withMessage('Le nom doit contenir au moins 2 caractères.'),

  body('prenom')
    .notEmpty().withMessage('Le prénom est obligatoire.')
    .isString().withMessage('Le prénom doit être une chaîne de caractères.')
    .isLength({ min: 2 }).withMessage('Le prénom doit contenir au moins 2 caractères.')
];

// Validation pour la vérification d'email (verifyEmail)
const verifyEmailValidator = [
  query('email')
    .notEmpty().withMessage('L\'email est obligatoire.')
    .isEmail().withMessage('L\'email doit être valide.'),

  query('code')
    .notEmpty().withMessage('Le code de vérification est obligatoire.')
    .isNumeric().withMessage('Le code de vérification doit être un nombre.')
];

// Validation pour la connexion (loginUser)
const loginValidator = [
  body('email')
    .notEmpty().withMessage('L\'email est obligatoire.')
    .isEmail().withMessage('L\'email doit être valide.'),
  body('mot_de_passe')
    .notEmpty().withMessage('Le mot de passe est obligatoire.')
];

module.exports = {
  registerValidator,
  verifyEmailValidator,
  loginValidator,
};
