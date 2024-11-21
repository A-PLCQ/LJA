// errorHandler.js - Middleware de gestion des erreurs

const logger = require('../config/logger');
const { handleError } = require('../helpers/customErrors');

const errorHandler = (err, req, res, next) => {
  // Log l'erreur complète côté serveur
  logger.error(`Erreur: ${err.message}`, { stack: err.stack });

  // Utilise la fonction `handleError` pour gérer la réponse
  handleError(err, req, res);
};

module.exports = errorHandler;
