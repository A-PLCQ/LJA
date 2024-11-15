// authService.js - Service d'authentification

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { RefreshTokens, User } = require('../models/index'); // Assurez-vous que le chemin est correct
const config = require('../config/config');

// Générer un token d'accès
const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role, iat: Math.floor(Date.now() / 1000) },
    config.jwt.secret,
    { expiresIn: '5m', algorithm: 'HS256', audience: 'ecommerce_app', issuer: 'auth_service' }
  );
};

// Générer un token de rafraîchissement
const generateRefreshToken = async (user, ipAddress, deviceInfo) => {
  const refreshToken = jwt.sign(
    { id: user.id, iat: Math.floor(Date.now() / 1000) },
    config.jwt.refreshSecret,
    { expiresIn: '7d', audience: 'ecommerce_app', issuer: 'auth_service' }
  );

  await RefreshTokens.create({
    user_id: user.id,
    token: refreshToken,
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    ip_address: ipAddress,
    device_info: deviceInfo,
  });

  return refreshToken;
};

// Vérifier un token d'accès
const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.secret, { audience: 'ecommerce_app', issuer: 'auth_service' });
  } catch (err) {
    throw new Error('Token invalide ou expiré');
  }
};

// Vérifier un token de rafraîchissement
const verifyRefreshToken = async (token) => {
  try {
    const decoded = jwt.verify(token, config.jwt.refreshSecret, { audience: 'ecommerce_app', issuer: 'auth_service' });
    const refreshToken = await RefreshTokens.findOne({ where: { token, is_revoked: false } });
    if (!refreshToken) {
      throw new Error('Token de rafraîchissement invalide ou révoqué');
    }
    return decoded;
  } catch (err) {
    throw new Error('Token de rafraîchissement invalide ou expiré');
  }
};

// Rafraîchir un token d'accès
const refreshAccessToken = async (refreshToken) => {
  const decoded = await verifyRefreshToken(refreshToken);
  const user = await User.findByPk(decoded.id);
  if (!user) {
    throw new Error('Utilisateur non trouvé');
  }
  // Révoquer l'ancien token de rafraîchissement et en générer un nouveau
  await revokeRefreshToken(refreshToken);
  const newRefreshToken = await generateRefreshToken(user, "unknown", "unknown");
  const newAccessToken = generateAccessToken(user);
  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
};

// Révoquer un token de rafraîchissement
const revokeRefreshToken = async (token) => {
  const refreshToken = await RefreshTokens.findOne({ where: { token } });
  if (refreshToken) {
    refreshToken.is_revoked = true;
    await refreshToken.save();
  }
};

// Hacher un mot de passe
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(12); // Utiliser un coût plus élevé pour augmenter la sécurité
  return await bcrypt.hash(password, salt);
};

// Comparer les mots de passe
const comparePasswords = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  refreshAccessToken,
  revokeRefreshToken,
  hashPassword,
  comparePasswords,
};
