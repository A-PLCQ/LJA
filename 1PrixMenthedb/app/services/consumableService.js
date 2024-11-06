// consumableService.js
const db = require('../config/db');

// Vérifier si un consommable est en stock
const validateConsumableInStock = async (consumableId, quantity) => {
  const [consumable] = await db.query(
    `SELECT stock FROM consumables WHERE id_consumable = ?`, [consumableId]
  );

  if (!consumable || consumable.length === 0) {
    throw new Error(`Consommable avec l'ID ${consumableId} introuvable`);
  }

  if (consumable[0].stock < quantity) {
    throw new Error(`Quantité demandée pour le consommable ${consumableId} non disponible en stock`);
  }

  return true;
};

// Obtenir les informations d'un consommable par ID
const getConsumableById = async (consumableId) => {
  const [consumable] = await db.query(
    `SELECT * FROM consumables WHERE id_consumable = ?`, [consumableId]
  );

  if (!consumable || consumable.length === 0) {
    throw new Error(`Consommable avec l'ID ${consumableId} introuvable`);
  }

  return consumable[0];
};

// Mettre à jour le stock d'un consommable après une commande
const updateConsumableStock = async (consumableId, quantity) => {
  const [consumable] = await db.query(
    `SELECT stock FROM consumables WHERE id_consumable = ?`, [consumableId]
  );

  if (!consumable || consumable.length === 0) {
    throw new Error(`Consommable avec l'ID ${consumableId} introuvable`);
  }

  const newStock = consumable[0].stock - quantity;
  if (newStock < 0) {
    throw new Error(`Stock insuffisant pour le consommable ${consumableId}`);
  }

  await db.query(
    `UPDATE consumables SET stock = ? WHERE id_consumable = ?`, [newStock, consumableId]
  );

  return { consumableId, newStock };
};

// Obtenir le prix d'un consommable par ID
const getConsumablePriceById = async (consumableId) => {
  const [consumable] = await db.query(
    `SELECT price FROM consumables WHERE id_consumable = ?`, [consumableId]
  );

  if (!consumable || consumable.length === 0) {
    throw new Error(`Consommable avec l'ID ${consumableId} introuvable`);
  }

  return consumable[0].price;
};

module.exports = {
  validateConsumableInStock,
  getConsumableById,
  updateConsumableStock,
  getConsumablePriceById,
};
