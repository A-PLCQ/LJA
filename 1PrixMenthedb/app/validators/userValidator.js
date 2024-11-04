// userValidator.js

const Joi = require('joi');

// Validation for user signup
const validateCreateUser = (req, res, next) => {
  console.log('Requête reçue pour validateCreateUser:', req.body);
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Email invalide',
      'any.required': 'L\'email est requis'
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Le mot de passe doit contenir au moins 6 caractères',
      'any.required': 'Le mot de passe est requis'
    }),
    username: Joi.string().required().messages({
      'any.required': 'Le nom d\'utilisateur est requis'
    }),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    console.error('Erreur de validation:', error.details);
    return res.status(400).json({ errors: error.details.map((detail) => detail.message) });
  }
  next();
};

// Validation for user login
const validateLoginUser = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': 'Email invalide',
      'any.required': 'L\'email est requis'
    }),
    password: Joi.string().required().messages({
      'any.required': 'Le mot de passe est requis'
    }),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ errors: error.details.map((detail) => detail.message) });
  }
  next();
};

// Export the validators as middlewares
module.exports = {
  validateCreateUser,
  validateLoginUser,
};
