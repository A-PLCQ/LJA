require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Générer le token JWT
const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }

  const payload = {
    id_utilisateur: user.id_utilisateur,
    email: user.email,
    role: user.role,
  };

  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Générer un Refresh Token et l'enregistrer dans la base de données
const generateRefreshToken = async (user) => {
  if (!process.env.JWT_REFRESH_SECRET) {
    throw new Error('JWT_REFRESH_SECRET is not defined');
  }

  const refreshToken = jwt.sign({}, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

  await db.query(
    'INSERT INTO refresh_tokens (token, user_id, expires_at) VALUES (?, ?, ?)',
    [
      refreshToken,
      user.id_utilisateur,
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    ]
  );

  return refreshToken;
};

// Vérifier le token JWT
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw new Error('Invalid or expired token');
  }
};

module.exports = {
  generateToken,
  generateRefreshToken,
  verifyToken,
  hashPassword: async (password) => await bcrypt.hash(password, 10),
  comparePasswords: async (password, hashedPassword) => await bcrypt.compare(password, hashedPassword),
};
