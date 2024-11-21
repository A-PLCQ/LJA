const bcrypt = require('bcrypt');
const logger = require('../config/logger');

// Hacher un mot de passe
const hashPassword = async (password) => {
  try {
    const salt = await bcrypt.genSalt(12); // Génération du sel
    const hashedPassword = await bcrypt.hash(password, salt); // Hachage
    logger.info('Mot de passe haché avec succès.');
    return hashedPassword;
  } catch (error) {
    logger.error(`Erreur lors du hachage du mot de passe : ${error.message}`);
    throw new Error('Erreur interne lors du hachage du mot de passe.');
  }
};

// Comparer les mots de passe
const comparePasswords = async (plainPassword, hashedPassword) => {
  try {
    const match = await bcrypt.compare(plainPassword, hashedPassword);
    if (!match) {
      logger.warn('Mot de passe incorrect.');
    }
    return match;
  } catch (error) {
    logger.error(`Erreur lors de la comparaison des mots de passe : ${error.message}`);
    throw new Error('Erreur interne lors de la comparaison des mots de passe.');
  }
};

module.exports = {
  hashPassword,
  comparePasswords,
};
