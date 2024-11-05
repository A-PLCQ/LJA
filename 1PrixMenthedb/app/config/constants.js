// constants.js - Définitions des constantes globales

// Statuts de commande
const ORDER_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  SHIPPED: 'shipped',
};

// Statuts de paiement
const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

// Types de produits
const PRODUCT_TYPE = {
  PRINTER: 'printer',
  CONSUMABLE: 'consumable',
};

// Méthodes de paiement
const PAYMENT_METHOD = {
  CREDIT_CARD: 'credit_card',
  PAYPAL: 'paypal',
  BANK_TRANSFER: 'bank_transfer',
};

// Rôles utilisateurs
const USER_ROLES = {
  USER: 'user',
  MANAGER: 'manager',
  ADMIN: 'admin',
};

// Statuts de livraison
const DELIVERY_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  DELIVERED: 'delivered',
  FAILED: 'failed',
};

// Codes de réponse HTTP
const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

// Catégories de produits
const PRODUCT_CATEGORY = {
  ELECTRONICS: 'electronics',
  FURNITURE: 'furniture',
  OFFICE_SUPPLIES: 'office_supplies',
};

// Statuts utilisateur
const USER_STATUS = {
  ACTIVE: 'active',
  BANNED: 'banned',
  PENDING_VERIFICATION: 'pending_verification',
};

// Exports
module.exports = {
  ORDER_STATUS,
  PAYMENT_STATUS,
  PRODUCT_TYPE,
  PAYMENT_METHOD,
  USER_ROLES,
  DELIVERY_STATUS,
  HTTP_STATUS,
  PRODUCT_CATEGORY,
  USER_STATUS,
};
