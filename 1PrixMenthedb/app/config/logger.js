// logger.js - Winston Logger Configuration

const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');

// Déterminer l'environnement
const env = process.env.NODE_ENV || 'development';
const consoleLogLevel = env === 'development' ? 'debug' : 'info';

const logFormat = format.printf(({ timestamp, level, message }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// Configuration de Winston Logger
const logger = createLogger({
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    new transports.Console({
      level: consoleLogLevel, // Niveau de log ajusté pour le développement
      format: format.combine(
        format.colorize(),
        format.simple()
      )
    }),
    new transports.DailyRotateFile({
      filename: 'logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '14d',
      level: 'info'
    }),
    new transports.DailyRotateFile({
      filename: 'logs/error-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '30d',
      level: 'error'
    })
  ],
  exceptionHandlers: [
    new transports.File({ filename: 'logs/exceptions.log' })
  ],
  rejectionHandlers: [
    new transports.File({ filename: 'logs/rejections.log' })
  ]
});

module.exports = {
  info: (message) => logger.info(message),
  error: (message) => logger.error(message),
  debug: (message) => logger.debug(message),
  warn: (message) => logger.warn(message)
};
