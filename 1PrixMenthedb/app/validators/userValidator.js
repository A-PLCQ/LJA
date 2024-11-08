// userValidator.js - Validation centralisée pour les utilisateurs

const { body, validationResult } = require('express-validator');

// Middleware pour valider les données lors de l'inscription d'un utilisateur
const validateCreateUser = [
  body('nom').isString().isLength({ min: 2 }).withMessage('Le nom doit contenir au moins 2 caractères.'),
  body('prenom').isString().isLength({ min: 2 }).withMessage('Le prénom doit contenir au moins 2 caractères.'),
  body('email').isEmail().withMessage('Veuillez entrer un email valide.'),
  body('password')
    .isLength({ min: 8 }).withMessage('Le mot de passe doit contenir au moins 8 caractères')
    .matches(/[A-Z]/).withMessage('Le mot de passe doit contenir au moins une lettre majuscule')
    .matches(/[a-z]/).withMessage('Le mot de passe doit contenir au moins une lettre minuscule')
    .matches(/[0-9]/).withMessage('Le mot de passe doit contenir au moins un chiffre')
    .matches(/[\W_]/).withMessage('Le mot de passe doit contenir au moins un caractère spécial'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Middleware pour valider les données lors de la mise à jour du profil utilisateur
const validateUpdateUserProfile = [
  body('nom').optional().isString().isLength({ min: 2 }).withMessage('Le nom doit contenir au moins 2 caractères.'),
  body('prenom').optional().isString().isLength({ min: 2 }).withMessage('Le prénom doit contenir au moins 2 caractères.'),
  body('email').optional().isEmail().withMessage('Email invalide'),
  body('password')
    .optional()
    .isLength({ min: 8 }).withMessage('Le mot de passe doit contenir au moins 8 caractères')
    .matches(/[A-Z]/).withMessage('Le mot de passe doit contenir au moins une lettre majuscule')
    .matches(/[a-z]/).withMessage('Le mot de passe doit contenir au moins une lettre minuscule')
    .matches(/[0-9]/).withMessage('Le mot de passe doit contenir au moins un chiffre')
    .matches(/[\W_]/).withMessage('Le mot de passe doit contenir au moins un caractère spécial'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Middleware pour valider les données lors de la connexion d'un utilisateur
const validateLoginUser = [
  body('email').isEmail().withMessage('Email invalide'),
  body('password').isLength({ min: 8 }).withMessage('Le mot de passe doit contenir au moins 8 caractères'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Middleware pour valider la réinitialisation du mot de passe avec le code et le nouveau mot de passe
const validateResetPasswordConfirmation = [
  body('email').isEmail().withMessage('Email invalide'),
  body('code').isLength({ min: 6, max: 6 }).withMessage('Le code doit contenir 6 chiffres'),
  body('newPassword')
    .isLength({ min: 8 }).withMessage('Le nouveau mot de passe doit contenir au moins 8 caractères')
    .matches(/[A-Z]/).withMessage('Le nouveau mot de passe doit contenir au moins une lettre majuscule')
    .matches(/[a-z]/).withMessage('Le nouveau mot de passe doit contenir au moins une lettre minuscule')
    .matches(/[0-9]/).withMessage('Le nouveau mot de passe doit contenir au moins un chiffre')
    .matches(/[\W_]/).withMessage('Le nouveau mot de passe doit contenir au moins un caractère spécial'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Middleware pour valider la demande de réinitialisation de mot de passe
const validatePasswordReset = [
  body('email').isEmail().withMessage('Email invalide'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];

// Exports
module.exports = {
  validateCreateUser,
  validateLoginUser,
  validateUpdateUserProfile,
  validatePasswordReset,
  validateResetPasswordConfirmation,
};
