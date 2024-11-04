// config/config.js - Centralized Configuration File

require('dotenv').config(); // Load environment variables from the .env file

// Validation to ensure all necessary environment variables are set
const requiredEnvVariables = [
  'EMAIL_USER',
  'EMAIL_PASS',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
  'DB_HOST',
  'DB_USER',
  'DB_PASSWORD',
  'DB_NAME',
  'PORT'
];

requiredEnvVariables.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing ${key} in .env file`);
  }
});

// Exporting configuration values
module.exports = {
  email: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
  },
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    connectionLimit: process.env.DB_CONNECTION_LIMIT || 10,
  },
  port: process.env.PORT,
};
