// authMiddleware.js - Middleware for Authentication

require('dotenv').config(); // Charge les variables d'environnement
const jwt = require('jsonwebtoken');
const logger = require('../config/logger'); // Logger Winston pour capturer les événements d'authentification

// Middleware générique d'authentification et d'autorisation
const authMiddleware = (requiredRole) => (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn(`Authentication failed: Missing or malformed Authorization header. IP: ${req.ip}, URL: ${req.originalUrl}`);
    return res.status(401).send({ message: 'Access Denied. No token provided.' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Vérifie le token JWT
    
    // S'assurer que l'ID utilisateur est un nombre valide
    if (typeof decoded.id_utilisateur !== 'number') {
      throw new Error("L'identifiant utilisateur extrait du token n'est pas un nombre valide.");
    }

    req.user = {
      id_utilisateur: decoded.id_utilisateur, // Assignation de l'ID utilisateur comme un nombre
      role: decoded.role
    };

    // Vérification du rôle requis
    if (requiredRole && decoded.role !== requiredRole) {
      logger.warn(`Authorization failed: User role '${decoded.role}' does not match required role '${requiredRole}'. IP: ${req.ip}, URL: ${req.originalUrl}`);
      return res.status(403).send({ message: 'Access Denied. Insufficient privileges.' });
    }

    next(); // Continue si tout est correct
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      logger.warn(`Authentication failed: Token expired. IP: ${req.ip}, URL: ${req.originalUrl}`);
      return res.status(401).send({ message: 'Token expired. Please log in again.' });
    }

    logger.error(`Authentication failed: Invalid token. IP: ${req.ip}, URL: ${req.originalUrl}, Error: ${err.message}`);
    res.status(400).send({ message: 'Invalid token' });
  }
};

module.exports = {
  authMiddleware: authMiddleware(), // Middleware standard
  adminMiddleware: authMiddleware('admin'), // Middleware pour les administrateurs
};
