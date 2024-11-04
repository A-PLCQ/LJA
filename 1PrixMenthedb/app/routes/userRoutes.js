// userRoutes.js - Routes for User Operations

const express = require('express');
const userController = require('../controllers/userController');
const userValidator = require('../validators/userValidator');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// Debugging log to verify imported functions
console.log('userController:', userController);
console.log('userValidator:', userValidator);
console.log('authMiddleware:', authMiddleware);

// Sign Up Route
router.post('/signup', (req, res, next) => {
  console.log('Route /signup appelée');
  userValidator.validateCreateUser(req, res, next);
}, userController.signUp);

// Login Route
router.post('/login', (req, res, next) => {
  console.log('Route /login appelée');
  userValidator.validateLoginUser(req, res, next);
}, userController.login);

// Get User by ID Route (Auth required)
router.get('/:id', (req, res, next) => {
  console.log('Route /:id appelée');
  authMiddleware.authMiddleware(req, res, next);
}, userController.getUserById);

// Request Password Reset Route
router.post('/request-password-reset', (req, res, next) => {
  console.log('Route /request-password-reset appelée');
  userValidator.validateLoginUser(req, res, next);
}, userController.requestPasswordReset);

// Reset Password Route
router.post('/reset-password/:token', userController.resetPassword);

// Refresh Token Route
router.post('/refresh-token', userController.refreshToken);

module.exports = router;
