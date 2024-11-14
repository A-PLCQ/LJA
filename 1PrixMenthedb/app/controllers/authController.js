// authController.js - Contrôleur d'authentification

const authService = require('../services/authService');

// Rafraîchir un token d'accès
const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: 'Token de rafraîchissement requis.' });
    }

    // Rafraîchir le token d'accès en utilisant le service authService
    const tokens = await authService.refreshAccessToken(refreshToken);
    res.status(200).json(tokens);
  } catch (error) {
    res.status(401).json({ message: 'Token de rafraîchissement invalide ou expiré.', error: error.message });
  }
};

module.exports = {
  refreshAccessToken,
};
