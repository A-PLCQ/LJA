
// printerController.js - Gestion des opérations pour les imprimantes

const { ValidationError, NotFoundError } = require('../helpers/customErrors');
const logger = require('../config/logger');
const { Printers, Images } = require('../models');
const { HTTP_STATUS } = require('../config/constants');

// Récupérer toutes les imprimantes avec l'image principale
const getPrinters = async (req, res) => {
  try {
    const printers = await Printers.findAll({
      include: [{
        model: Images,
        as: 'images', // Utilisation explicite de l'alias
        where: { is_primary: true },
        attributes: ['url'],
        required: false,
      }],
    });

    printers.forEach(printer => {
      if (printer.images.length > 0) {
        printer.images.forEach(image => {
          // Normalisation du chemin d'accès
          image.url = image.url
            .replace(/\\/g, '/') // Remplace les backslashes par des slashes
            .replace(/ /g, '-'); // Remplace les espaces par des tirets
        });
      }
    });

    res.status(HTTP_STATUS.OK).json(printers);
  } catch (error) {
    logger.error(`Erreur lors de la récupération des imprimantes : ${error.message}`);
    res.status(HTTP_STATUS.SERVER_ERROR).json({ message: 'Erreur serveur' });
  }
};

// Obtenir les détails d'une imprimante par ID avec toutes ses images
const getPrinterById = async (req, res) => {
  try {
    const { id } = req.params;
    const printer = await Printers.findByPk(id, {
      include: [
        {
          model: Images,
          as: 'images', // Correction ici également
          attributes: ['url'],
          order: [['is_primary', 'DESC']],
        },
      ],
    });

    if (!printer) {
      throw new NotFoundError('Imprimante non trouvée');
    }

    printer.images.forEach(img => {
      img.url = img.url.replace(/\\/g, '/').replace(/ /g, '%20');
    });

    res.status(HTTP_STATUS.OK).json(printer);
  } catch (error) {
    logger.error(`Erreur lors de la récupération de l'imprimante : ${error.message}`);
    res.status(error.statusCode || HTTP_STATUS.SERVER_ERROR).json({ message: error.message });
  }
};

// Ajouter une nouvelle imprimante
const addPrinter = async (req, res) => {
  const { brand, product_series, model, reference, price, weight_kg, print_speed_ppm, scan_speed_ipm, copy_volume_per_month, color_support, supports_A3, supports_A4, connectivity, stock, short_description, detailed_description } = req.body;

  try {
    if (!brand || !model || !reference || !price) {
      throw new ValidationError('Les champs obligatoires sont manquants');
    }

    const newPrinter = await Printers.create({
      brand,
      product_series,
      model,
      reference,
      price,
      weight_kg,
      print_speed_ppm,
      scan_speed_ipm,
      copy_volume_per_month,
      color_support,
      supports_A3,
      supports_A4,
      connectivity,
      stock,
      short_description,
      detailed_description,
    });

    res.status(HTTP_STATUS.CREATED).json({ message: 'Imprimante ajoutée avec succès', printer: newPrinter });
  } catch (error) {
    logger.error(`Erreur lors de l'ajout de l'imprimante : ${error.message}`);
    res.status(error.statusCode || HTTP_STATUS.SERVER_ERROR).json({ message: error.message });
  }
};

// Mettre à jour les informations d'une imprimante par ID
const updatePrinter = async (req, res) => {
  try {
    const { id } = req.params;
    const printer = await Printers.findByPk(id);
    if (!printer) {
      throw new NotFoundError('Imprimante non trouvée');
    }

    await printer.update(req.body);
    res.status(HTTP_STATUS.OK).json({ message: 'Imprimante mise à jour avec succès', printer });
  } catch (error) {
    logger.error(`Erreur lors de la mise à jour de l'imprimante : ${error.message}`);
    res.status(error.statusCode || HTTP_STATUS.SERVER_ERROR).json({ message: error.message });
  }
};

// Supprimer une imprimante par ID
const deletePrinter = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Printers.destroy({ where: { id_printer: id } });
    if (result === 0) {
      throw new NotFoundError('Imprimante non trouvée');
    }
    res.status(HTTP_STATUS.OK).json({ message: 'Imprimante supprimée avec succès' });
  } catch (error) {
    logger.error(`Erreur lors de la suppression de l'imprimante : ${error.message}`);
    res.status(error.statusCode || HTTP_STATUS.SERVER_ERROR).json({ message: error.message });
  }
};

module.exports = {
  addPrinter,
  getPrinters,
  getPrinterById,
  updatePrinter,
  deletePrinter,
};
