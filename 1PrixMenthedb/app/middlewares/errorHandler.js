// errorHandler.js - Middleware de gestion des erreurs
const logger = require('../config/logger');
const { CustomError } = require('../helpers/customErrors');

const errorHandler = (err, req, res, next) => {
  // Log l'erreur complète côté serveur
  logger.error(`Erreur: ${err.message}`, { stack: err.stack });

  // Utilise le code de statut de l'erreur si défini, sinon 500 par défaut
  const statusCode = err.statusCode || 500;

  // Envoie une réponse JSON uniforme
  res.status(statusCode).json({
    message: err.message || 'Une erreur serveur est survenue',
  });
};

module.exports = errorHandler;
