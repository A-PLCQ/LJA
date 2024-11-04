// adminMiddleware.js

const db = require('../config/db');
const logger = require('../config/logger');

// Middleware to verify admin privileges
const adminMiddleware = async (req, res, next) => {
  try {
    const { id_utilisateur } = req.user; // Assumes `req.user` is defined by `authMiddleware`

    // Query to get the role of the user from the database
    const [users] = await db.query('SELECT role FROM utilisateur WHERE id_utilisateur = ?', [id_utilisateur]);
    
    if (users.length === 0) {
      logger.warn(`Admin verification failed: User not found with ID ${id_utilisateur}`);
      return res.status(403).send({ message: 'Access denied. User not found.' });
    }

    const user = users[0];

    // Check if the user's role is 'admin'
    if (user.role !== 'admin') {
      logger.warn(`Access denied for user ID ${id_utilisateur}: Not an admin`);
      return res.status(403).send({ message: 'Access denied. Admin only.' });
    }

    // Continue if the user is an admin
    next();
  } catch (err) {
    logger.error(`Error during admin verification for user ID ${req.user.id_utilisateur}: ${err.message}`);
    res.status(500).send({ message: 'Server error' });
  }
};

module.exports = adminMiddleware;
