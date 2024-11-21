// customErrors.js - Définitions des erreurs personnalisées

class CustomError extends Error {
  constructor(message, statusCode, errorCode = null) {
      super(message);
      this.name = this.constructor.name;
      this.statusCode = statusCode || 500; // Code de statut HTTP par défaut : 500 (Erreur interne du serveur)
      this.errorCode = errorCode; // Nouveau code d'erreur pour une meilleure granularité
      Error.captureStackTrace(this, this.constructor);
  }
}

class NotFoundError extends CustomError {
  constructor(message = 'Ressource non trouvée') {
      super(message, 404);
  }
}

class ValidationError extends CustomError {
  constructor(errors = null) {
      const message = errors
          ? `Erreur de validation : ${Object.entries(errors).map(([field, error]) => `${field} ${error}`).join(', ')}`
          : 'Erreur de validation des données';
      super(message, 400);
  }
}

class UnauthorizedError extends CustomError {
  constructor(message = 'Accès non autorisé') {
      super(message, 401, 'AUTH_01');
  }
}

class ForbiddenError extends CustomError {
  constructor(message = 'Accès interdit') {
      super(message, 403);
  }
}

class ConflictError extends CustomError {
  constructor(message = 'Conflit de ressource') {
      super(message, 409);
  }
}

class BadRequestError extends CustomError {
  constructor(message = 'Requête invalide') {
      super(message, 400);
  }
}

class InternalServerError extends CustomError {
  constructor(message = 'Erreur interne du serveur') {
      super(message, 500);
  }
}

// Fonction utilitaire pour la gestion globale des erreurs
function handleError(err, req, res) {
  if (err instanceof CustomError) {
      res.status(err.statusCode).json({
          error: {
              name: err.name,
              message: err.message,
              code: err.errorCode || null,
          },
      });
  } else {
      console.error('Erreur non gérée :', err);
      res.status(500).json({
          error: {
              name: 'InternalServerError',
              message: 'Une erreur interne est survenue',
          },
      });
  }
}

module.exports = {
  CustomError,
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
  BadRequestError,
  InternalServerError,
  handleError,
};
