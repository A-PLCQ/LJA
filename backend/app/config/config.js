// config/config.js - Centralized Configuration File
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

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
    console.log(`Missing variable: ${key}`); // Debug
    throw new Error(`Missing ${key} in .env file`);
  }
});

module.exports = {
  email: {
    host: process.env.EMAIL_HOST,  
    port: process.env.EMAIL_PORT || 587,  
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