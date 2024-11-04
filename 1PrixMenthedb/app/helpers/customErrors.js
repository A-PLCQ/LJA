// customErrors.js - Définitions des erreurs personnalisées
// customErrors.js

class CustomError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.name = this.constructor.name;
      this.statusCode = statusCode || 500; // Code de statut HTTP par défaut : 500 (Erreur interne du serveur)
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  class NotFoundError extends CustomError {
    constructor(message = 'Ressource non trouvée') {
      super(message, 404);
    }
  }
  
  class ValidationError extends CustomError {
    constructor(message = 'Erreur de validation des données') {
      super(message, 400);
    }
  }
  
  class UnauthorizedError extends CustomError {
    constructor(message = 'Accès non autorisé') {
      super(message, 401);
    }
  }
  
  module.exports = {
    CustomError,
    NotFoundError,
    ValidationError,
    UnauthorizedError,
  };
  