// authMiddleware.js - Middleware d'authentification et d'autorisation

require('dotenv').config();
const jwt = require('jsonwebtoken');
const logger = require('../config/logger'); // Logger Winston pour capturer les événements d'authentification
const { User } = require('../config/db'); // Importer le modèle User avec Sequelize

// Middleware générique d'authentification et d'autorisation
const authMiddleware = (requiredRoles) => async (req, res, next) => {
  try {
    // Vérifie si req est un objet de requête valide et que l'en-tête d'autorisation est correct
    if (!req || typeof req.header !== 'function') {
      throw new Error("L'objet req n'est pas valide. Veuillez vérifier l'appel du middleware.");
    }

    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logger.warn(`Authentication failed: Missing or malformed Authorization header. IP: ${req.ip}, URL: ${req.originalUrl}`);
      return res.status(401).send({ message: 'Accès refusé. Aucun token fourni.' });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Vérifie le token JWT

    // Vérification de l'existence de l'utilisateur dans la base de données
    const user = await User.findByPk(decoded.id_utilisateur);
    if (!user) {
      logger.warn(`Authentication failed: User not found with ID ${decoded.id_utilisateur}. IP: ${req.ip}, URL: ${req.originalUrl}`);
      return res.status(401).send({ message: 'Accès refusé. Utilisateur non trouvé.' });
    }

    // Assurer la cohérence des rôles
    if (requiredRoles && !requiredRoles.includes(user.role)) {
      logger.warn(`Authorization failed: User role '${user.role}' does not match any of the required roles '${requiredRoles.join(', ')}'. IP: ${req.ip}, URL: ${req.originalUrl}`);
      return res.status(403).send({ message: 'Accès refusé. Privilèges insuffisants.' });
    }

    // Ajouter les informations utilisateur à l'objet req pour les prochains middlewares ou contrôleurs
    req.user = {
      id_utilisateur: user.id_utilisateur,
      role: user.role,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
    };

    next(); // Continue si tout est correct
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      logger.warn(`Authentication failed: Token expired. IP: ${req.ip}, URL: ${req.originalUrl}`);
      return res.status(401).send({ message: 'Token expiré. Veuillez vous reconnecter.' });
    }

    logger.error(`Authentication failed: Invalid token. IP: ${req.ip}, URL: ${req.originalUrl}, Error: ${err.message}`);
    res.status(400).send({ message: 'Token invalide' });
  }
};

module.exports = {
  authMiddleware, // Middleware standard pour tous les rôles, à utiliser avec des rôles spécifiques au besoin
  adminMiddleware: authMiddleware(['admin']), // Middleware pour les administrateurs uniquement
};
