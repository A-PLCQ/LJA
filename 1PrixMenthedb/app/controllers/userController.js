// userController.js - Controller for User Operations

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // Assuming you have a MySQL connection file
const logger = require('../config/logger');
require('dotenv').config();

// Sign Up a New User
const signUp = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user to the database
    const query = 'INSERT INTO users (email, password, username) VALUES (?, ?, ?)';
    await db.query(query, [email, hashedPassword, username]);

    res.status(201).json({ message: 'Utilisateur créé avec succès' });
  } catch (error) {
    logger.error("Erreur lors de la création de l'utilisateur:", error);
    res.status(500).json({ error: "Erreur lors de la création de l'utilisateur" });
  }
};

// Log in a User
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Utilisateur non trouvé' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Mot de passe incorrect' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Connexion réussie', token });
  } catch (error) {
    logger.error("Erreur lors de la connexion de l'utilisateur:", error);
    res.status(500).json({ error: 'Erreur lors de la connexion' });
  }
};

// Get User by ID
const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    // Retrieve user by ID
    const [rows] = await db.query('SELECT id, email, username FROM users WHERE id = ?', [userId]);
    const user = rows[0];

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.status(200).json(user);
  } catch (error) {
    logger.error("Erreur lors de la récupération de l'utilisateur:", error);
    res.status(500).json({ error: "Erreur lors de la récupération de l'utilisateur" });
  }
};

// Request Password Reset
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user by email
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];

    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Generate reset token
    const resetToken = jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '15m' });
    // Send reset token via email (mocked)
    logger.info(`Email de réinitialisation envoyé à ${email} avec le token : ${resetToken}`);

    res.status(200).json({ message: 'Email de réinitialisation envoyé' });
  } catch (error) {
    logger.error('Erreur lors de la demande de réinitialisation du mot de passe:', error);
    res.status(500).json({ error: 'Erreur lors de la demande de réinitialisation du mot de passe' });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;

    // Verify reset token
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password in the database
    await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, decoded.userId]);

    res.status(200).json({ message: 'Mot de passe réinitialisé avec succès' });
  } catch (error) {
    logger.error('Erreur lors de la réinitialisation du mot de passe:', error);
    res.status(500).json({ error: 'Erreur lors de la réinitialisation du mot de passe' });
  }
};

// Refresh Token
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    // Generate a new access token
    const newToken = jwt.sign({ userId: decoded.userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token: newToken });
  } catch (error) {
    logger.error('Erreur lors du renouvellement du token:', error);
    res.status(500).json({ error: 'Erreur lors du renouvellement du token' });
  }
};

module.exports = {
  signUp,
  login,
  getUserById,
  requestPasswordReset,
  resetPassword,
  refreshToken,
};
