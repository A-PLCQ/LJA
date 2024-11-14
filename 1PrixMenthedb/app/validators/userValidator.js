// userValidator.js - Validation des champs utilisateur pour la création de compte

const { body } = require('express-validator');

const userValidator = [
  // Validation de l'email
  body('email')
    .notEmpty().withMessage('L\'email est obligatoire.')
    .isEmail().withMessage('L\'email doit être valide.'),

  // Validation du mot de passe
  body('mot_de_passe')
    .notEmpty().withMessage('Le mot de passe est obligatoire.')
    .isLength({ min: 8 }).withMessage('Le mot de passe doit contenir au moins 8 caractères')
    .matches(/[A-Z]/).withMessage('Le mot de passe doit contenir au moins une lettre majuscule')
    .matches(/[a-z]/).withMessage('Le mot de passe doit contenir au moins une lettre minuscule')
    .matches(/[0-9]/).withMessage('Le mot de passe doit contenir au moins un chiffre')
    .matches(/[\W_]/).withMessage('Le mot de passe doit contenir au moins un caractère spécial'),

  // Validation du nom
  body('nom')
    .notEmpty().withMessage('Le nom est obligatoire.')
    .isString().withMessage('Le nom doit être une chaîne de caractères.')
    .isLength({ min: 2 }).withMessage('Le nom doit contenir au moins 2 caractères.'),

  // Validation du prénom
  body('prenom')
    .notEmpty().withMessage('Le prénom est obligatoire.')
    .isString().withMessage('Le prénom doit être une chaîne de caractères.')
    .isLength({ min: 2 }).withMessage('Le prénom doit contenir au moins 2 caractères.'),

  // Validation du numéro de téléphone
  body('telephone')
    .notEmpty().withMessage('Le numéro de téléphone est obligatoire.')
    .isString().withMessage('Le numéro de téléphone doit être une chaîne de caractères.')
    .matches(/^\d{10}$/).withMessage('Le numéro de téléphone doit contenir 10 chiffres.'),

  // Validation de l'adresse
  body('adresse')
    .notEmpty().withMessage('L\'adresse est obligatoire.')
    .isString().withMessage('L\'adresse doit être une chaîne de caractères.'),

  // Validation du SIRET
  body('siret')
    .notEmpty().withMessage('Le SIRET est obligatoire.')
    .isString().withMessage('Le SIRET doit être une chaîne de caractères.')
    .matches(/^\d{14}$/).withMessage('Le SIRET doit contenir exactement 14 chiffres.')
];

const loginValidator = [
  body('email')
    .notEmpty().withMessage('L\'email est obligatoire.')
    .isEmail().withMessage('L\'email doit être valide.'),
  body('mot_de_passe')
    .notEmpty().withMessage('Le mot de passe est obligatoire.')
];

const passwordChangeValidator = [
  body('ancien_mot_de_passe')
    .notEmpty().withMessage('L\'ancien mot de passe est obligatoire.'),
  body('nouveau_mot_de_passe')
    .notEmpty().withMessage('Le nouveau mot de passe est obligatoire.')
    .isLength({ min: 8 }).withMessage('Le mot de passe doit contenir au moins 8 caractères')
    .matches(/[A-Z]/).withMessage('Le mot de passe doit contenir au moins une lettre majuscule')
    .matches(/[a-z]/).withMessage('Le mot de passe doit contenir au moins une lettre minuscule')
    .matches(/[0-9]/).withMessage('Le mot de passe doit contenir au moins un chiffre')
    .matches(/[\W_]/).withMessage('Le mot de passe doit contenir au moins un caractère spécial')
];

// Validation pour la mise à jour du profil utilisateur
const updateUserProfileValidator = [
  body('email').optional().isEmail().withMessage("L'email doit être valide."),
  body('nom').optional().isString().isLength({ min: 2 }).withMessage('Le nom doit contenir au moins 2 caractères.'),
  body('prenom').optional().isString().isLength({ min: 2 }).withMessage('Le prénom doit contenir au moins 2 caractères.'),
  body('telephone').optional().matches(/^\d{10}$/).withMessage('Le numéro de téléphone doit contenir 10 chiffres.'),
  body('adresse').optional().isString().withMessage("L'adresse doit être une chaîne de caractères."),
];

module.exports = {
  userValidator,
  loginValidator,
  passwordChangeValidator,
  updateUserProfileValidator
};