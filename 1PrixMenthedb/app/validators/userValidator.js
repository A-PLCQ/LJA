// userValidator.js - Validation des champs pour les routes utilisateur

const { body } = require('express-validator');


// Validation pour mettre à jour le profil utilisateur (updateUserProfile)
const updateUserProfileValidator = [
  body('email')
    .optional()
    .isEmail().withMessage('L\'email doit être valide.'),
  body('nom')
    .optional()
    .isString().withMessage('Le nom doit être une chaîne de caractères.')
    .isLength({ min: 2 }).withMessage('Le nom doit contenir au moins 2 caractères.'),
  body('prenom')
    .optional()
    .isString().withMessage('Le prénom doit être une chaîne de caractères.')
    .isLength({ min: 2 }).withMessage('Le prénom doit contenir au moins 2 caractères.'),
  body('telephone')
    .optional()
    .matches(/^\d{10}$/).withMessage('Le numéro de téléphone doit contenir 10 chiffres.'),
  body('adresse')
    .optional()
    .isString().withMessage('L\'adresse doit être une chaîne de caractères.')
];

// Validation pour supprimer un utilisateur (deleteUser)
const deleteUserValidator = [
  body('mot_de_passe')
    .notEmpty().withMessage('Le mot de passe est obligatoire.')
];

// Validation pour demander la réinitialisation du mot de passe (requestPasswordReset)
const requestPasswordResetValidator = [
  body('email')
    .notEmpty().withMessage('L\'email est obligatoire.')
    .isEmail().withMessage('L\'email doit être valide.')
];

// Validation pour réinitialiser le mot de passe (resetPassword)
const resetPasswordValidator = [
  body('email')
    .notEmpty().withMessage('L\'email est obligatoire.')
    .isEmail().withMessage('L\'email doit être valide.'),
  body('resetCode')
    .notEmpty().withMessage('Le code de réinitialisation est obligatoire.')
    .isLength({ min: 6, max: 6 }).withMessage('Le code de réinitialisation doit contenir exactement 6 caractères.'),
  body('newPassword')
    .notEmpty().withMessage('Le nouveau mot de passe est obligatoire.')
    .isLength({ min: 8 }).withMessage('Le mot de passe doit contenir au moins 8 caractères.')
    .matches(/[A-Z]/).withMessage('Le mot de passe doit contenir au moins une lettre majuscule.')
    .matches(/[a-z]/).withMessage('Le mot de passe doit contenir au moins une lettre minuscule.')
    .matches(/[0-9]/).withMessage('Le mot de passe doit contenir au moins un chiffre.')
    .matches(/[\W_]/).withMessage('Le mot de passe doit contenir au moins un caractère spécial.')
];

module.exports = {
  updateUserProfileValidator,
  deleteUserValidator,
  requestPasswordResetValidator,
  resetPasswordValidator
};
