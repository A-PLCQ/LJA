// authService.js - Mise à jour pour ajouter la gestion sophistiquée des Refresh Tokens
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { JWT } = require('../config/constants');

// Générer le token JWT
const generateToken = (user) => {
  if (!JWT.SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  const payload = {
    id_utilisateur: user.id_utilisateur,
    email: user.email,
    role: user.role, // inclure le rôle dans le token
  };

  return jwt.sign(payload, JWT.SECRET, { expiresIn: JWT.EXPIRES_IN });
};

// Générer un Refresh Token et l'enregistrer dans la base de données
const generateRefreshToken = async (user) => {
  const refreshToken = jwt.sign({}, JWT.REFRESH_SECRET, { expiresIn: '7d' });

  // Stocker le refresh token dans la base de données
  await db.query(
    'INSERT INTO refresh_tokens (token, user_id, expires_at) VALUES (?, ?, ?)',
    [
      refreshToken,
      user.id_utilisateur,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Expiration dans 7 jours
    ]
  );

  return refreshToken;
};

// Vérifier le token JWT
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT.SECRET);
  } catch (err) {
    throw new Error('Invalid or expired token');
  }
};

// Rafraîchir un Refresh Token
const refreshAccessToken = async (refreshToken) => {
  try {
    // Décoder et vérifier le refresh token
    const decoded = jwt.verify(refreshToken, JWT.REFRESH_SECRET);

    // Vérifier si le token est valide dans la base de données
    const [tokens] = await db.query('SELECT * FROM refresh_tokens WHERE token = ? AND is_revoked = FALSE', [refreshToken]);
    if (tokens.length === 0) {
      throw new Error('Invalid or expired refresh token');
    }

    // Révoquer l'ancien refresh token
    await db.query('UPDATE refresh_tokens SET is_revoked = TRUE WHERE token = ?', [refreshToken]);

    // Générer un nouveau token d'accès et un nouveau refresh token
    const user = { id_utilisateur: decoded.id }; // Utilisateur récupéré via le refresh token
    const newAccessToken = generateToken(user);
    const newRefreshToken = await generateRefreshToken(user);

    return { token: newAccessToken, refreshToken: newRefreshToken };
  } catch (err) {
    throw new Error('Invalid refresh token');
  }
};

module.exports = {
  generateToken,
  generateRefreshToken,
  refreshAccessToken,
  hashPassword: async (password) => await bcrypt.hash(password, 10),
  comparePasswords: async (password, hashedPassword) => await bcrypt.compare(password, hashedPassword),
};
