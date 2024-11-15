// compatibleController.js - Gestion des relations de compatibilité entre consommables et imprimantes

const { Printers, Consumables, CompatiblePrinters } = require('../models');
const logger = require('../config/logger');
const { HTTP_STATUS } = require('../config/constants');

// Récupérer toutes les imprimantes compatibles pour un consommable donné
const getCompatiblePrintersByConsumable = async (req, res) => {
  try {
    const { id } = req.params;
    const consumable = await Consumables.findByPk(id, {
      include: [{
        model: Printers,
        as: 'compatiblePrinters', // Alias défini dans l'association
        through: { attributes: [] }, // Exclut les colonnes inutiles du pivot
        attributes: ['id_printer', 'brand', 'model', 'reference'],
      }],
    });

    if (!consumable) {
      return res.status(404).json({ message: 'Consommable non trouvé' });
    }

    res.status(HTTP_STATUS.OK).json(consumable.compatiblePrinters);
  } catch (error) {
    logger.error(`Erreur lors de la récupération des imprimantes compatibles : ${error.message}`);
    res.status(HTTP_STATUS.SERVER_ERROR).json({ message: 'Erreur serveur' });
  }
};

// Récupérer tous les consommables compatibles pour une imprimante donnée
const getCompatibleConsumablesByPrinter = async (req, res) => {
  try {
    const { id } = req.params;
    const printer = await Printers.findByPk(id, {
      include: [{
        model: Consumables,
        as: 'compatibleConsumables', // Alias défini dans l'association
        through: { attributes: [] },
        attributes: ['id_consumable', 'brand', 'model', 'reference'],
      }],
    });

    if (!printer) {
      return res.status(404).json({ message: 'Imprimante non trouvée' });
    }

    res.status(HTTP_STATUS.OK).json(printer.compatibleConsumables);
  } catch (error) {
    logger.error(`Erreur lors de la récupération des consommables compatibles : ${error.message}`);
    res.status(HTTP_STATUS.SERVER_ERROR).json({ message: 'Erreur serveur' });
  }
};

// Ajouter une relation de compatibilité
const addCompatibility = async (req, res) => {
  const { id_printer, id_consumable } = req.body;

  try {
    if (!id_printer || !id_consumable) {
      return res.status(400).json({ message: 'Les IDs d\'imprimante et de consommable sont obligatoires.' });
    }

    const compatibility = await CompatiblePrinters.create({ id_printer, id_consumable });

    res.status(HTTP_STATUS.CREATED).json({ message: 'Compatibilité ajoutée avec succès', compatibility });
  } catch (error) {
    logger.error(`Erreur lors de l'ajout de la compatibilité : ${error.message}`);
    res.status(HTTP_STATUS.SERVER_ERROR).json({ message: 'Erreur serveur' });
  }
};

// Supprimer une relation de compatibilité
const deleteCompatibility = async (req, res) => {
  const { id_printer, id_consumable } = req.params;

  try {
    const result = await CompatiblePrinters.destroy({
      where: { id_printer, id_consumable },
    });

    if (result === 0) {
      return res.status(404).json({ message: 'Compatibilité non trouvée' });
    }

    res.status(HTTP_STATUS.OK).json({ message: 'Compatibilité supprimée avec succès' });
  } catch (error) {
    logger.error(`Erreur lors de la suppression de la compatibilité : ${error.message}`);
    res.status(HTTP_STATUS.SERVER_ERROR).json({ message: 'Erreur serveur' });
  }
};

module.exports = {
  getCompatiblePrintersByConsumable,
  getCompatibleConsumablesByPrinter,
  addCompatibility,
  deleteCompatibility,
};
