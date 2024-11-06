// printerService.js
const db = require('../config/db');

// Vérifier si une imprimante est en stock
const validatePrinterInStock = async (printerId, quantity) => {
  const [printer] = await db.query(
    `SELECT stock FROM printers WHERE id_printer = ?`, [printerId]
  );

  if (!printer || printer.length === 0) {
    throw new Error(`Imprimante avec l'ID ${printerId} introuvable`);
  }

  if (printer[0].stock < quantity) {
    throw new Error(`Quantité demandée pour l'imprimante ${printerId} non disponible en stock`);
  }

  return true;
};

// Obtenir les informations d'une imprimante par ID
const getPrinterById = async (printerId) => {
  const [printer] = await db.query(
    `SELECT * FROM printers WHERE id_printer = ?`, [printerId]
  );

  if (!printer || printer.length === 0) {
    throw new Error(`Imprimante avec l'ID ${printerId} introuvable`);
  }

  return printer[0];
};

// Mettre à jour le stock d'une imprimante après une commande
const updatePrinterStock = async (printerId, quantity) => {
  const [printer] = await db.query(
    `SELECT stock FROM printers WHERE id_printer = ?`, [printerId]
  );

  if (!printer || printer.length === 0) {
    throw new Error(`Imprimante avec l'ID ${printerId} introuvable`);
  }

  const newStock = printer[0].stock - quantity;
  if (newStock < 0) {
    throw new Error(`Stock insuffisant pour l'imprimante ${printerId}`);
  }

  await db.query(
    `UPDATE printers SET stock = ? WHERE id_printer = ?`, [newStock, printerId]
  );

  return { printerId, newStock };
};

// Obtenir le prix d'une imprimante par ID
const getPrinterPriceById = async (printerId) => {
  const [printer] = await db.query(
    `SELECT price FROM printers WHERE id_printer = ?`, [printerId]
  );

  if (!printer || printer.length === 0) {
    throw new Error(`Imprimante avec l'ID ${printerId} introuvable`);
  }

  return printer[0].price;
};

module.exports = {
  validatePrinterInStock,
  getPrinterById,
  updatePrinterStock,
  getPrinterPriceById,
};
