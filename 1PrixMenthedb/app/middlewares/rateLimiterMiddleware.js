// rateLimiterMiddleware.js - Middleware to limit request rate

const rateLimit = require('express-rate-limit');

// Middleware to limit the rate of requests to the API
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Trop de requêtes effectuées depuis cette adresse IP, veuillez réessayer plus tard.',
  headers: true, // Include rate limit headers in the response
});

module.exports = limiter;
