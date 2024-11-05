const db = require('../config/db');
const { NotFoundError, ValidationError } = require('../helpers/customErrors');
const logger = require('../config/logger');

// Récupérer les consommables compatibles pour une imprimante spécifique
const getCompatibleConsumables = async (req, res) => {
  const { printerId } = req.params;

  try {
    const [consumables] = await db.query(`
      SELECT c.*
      FROM consumables c
      JOIN compatible_printers cp ON cp.id_consumable = c.id_consumable
      WHERE cp.id_printer = ?
    `, [printerId]);

    res.status(200).json(consumables);
  } catch (error) {
    logger.error(`Erreur lors de la récupération des consommables compatibles : ${error.message}`);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Récupérer les imprimantes compatibles pour un consommable spécifique
const getCompatiblePrinters = async (req, res) => {
  const { consumableId } = req.params;

  try {
    const [printers] = await db.query(`
      SELECT p.*
      FROM printers p
      JOIN compatible_printers cp ON cp.id_printer = p.id_printer
      WHERE cp.id_consumable = ?
    `, [consumableId]);

    res.status(200).json(printers);
  } catch (error) {
    logger.error(`Erreur lors de la récupération des imprimantes compatibles : ${error.message}`);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Ajouter une compatibilité entre une imprimante et un consommable
const addCompatibility = async (req, res) => {
  const { printerId, consumableId } = req.body;

  try {
    // Validation des IDs
    if (!printerId || !consumableId) {
      throw new ValidationError('Les IDs d\'imprimante et de consommable sont requis');
    }

    await db.query(`
      INSERT INTO compatible_printers (id_printer, id_consumable) 
      VALUES (?, ?)
    `, [printerId, consumableId]);

    res.status(201).json({ message: 'Compatibilité ajoutée avec succès' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ message: 'Cette compatibilité existe déjà' });
    } else {
      logger.error(`Erreur lors de l'ajout de la compatibilité : ${error.message}`);
      res.status(error.statusCode || 500).json({ message: 'Erreur serveur' });
    }
  }
};

// Supprimer une compatibilité entre une imprimante et un consommable
const removeCompatibility = async (req, res) => {
  const { printerId, consumableId } = req.body;

  try {
    const [result] = await db.query(`
      DELETE FROM compatible_printers 
      WHERE id_printer = ? AND id_consumable = ?
    `, [printerId, consumableId]);

    if (result.affectedRows === 0) {
      throw new NotFoundError('Compatibilité non trouvée');
    }

    res.status(200).json({ message: 'Compatibilité supprimée avec succès' });
  } catch (error) {
    logger.error(`Erreur lors de la suppression de la compatibilité : ${error.message}`);
    res.status(error.statusCode || 500).json({ message: 'Erreur serveur' });
  }
};

module.exports = {
  getCompatibleConsumables,
  getCompatiblePrinters,
  addCompatibility,
  removeCompatibility,
};
