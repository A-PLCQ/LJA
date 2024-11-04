// roleMiddleware.js - Middleware to verify user role privileges

const db = require('../config/db');
const logger = require('../config/logger');

// Middleware to verify if the user has specific role privileges
const roleMiddleware = (requiredRoles) => {
  return async (req, res, next) => {
    try {
      const { id_utilisateur } = req.user; // Assumes `req.user` is defined by `authMiddleware`

      // Query to get the role of the user from the database
      const [users] = await db.query('SELECT role FROM utilisateur WHERE id_utilisateur = ?', [id_utilisateur]);
      
      if (users.length === 0) {
        logger.warn(`Role verification failed: User not found with ID ${id_utilisateur}`);
        return res.status(403).send({ message: 'Access denied. User not found.' });
      }

      const user = users[0];

      // Check if the user's role is in the list of required roles
      if (!requiredRoles.includes(user.role)) {
        logger.warn(`Access denied for user ID ${id_utilisateur}: Required role(s) [${requiredRoles.join(', ')}], user has role '${user.role}'`);
        return res.status(403).send({ message: 'Access denied. Insufficient privileges.' });
      }

      // Continue if user has the required role
      next();
    } catch (err) {
      logger.error(`Error during role verification for user ID ${req.user.id_utilisateur}: ${err.message}`);
      res.status(500).send({ message: 'Server error' });
    }
  };
};

module.exports = roleMiddleware;
