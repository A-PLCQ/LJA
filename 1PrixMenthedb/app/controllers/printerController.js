// printerController.js - Gestion des opérations pour les imprimantes
const db = require('../config/db');
const { ValidationError, NotFoundError } = require('../helpers/customErrors');
const logger = require('../config/logger');

// Récupérer toutes les imprimantes avec l'image principale
const getAllPrinters = async (req, res) => {
    try {
        const [printers] = await db.query(`
        SELECT p.*, i.url AS primary_image 
        FROM printers p 
        LEFT JOIN images i ON i.id_printer = p.id_printer AND i.is_primary = TRUE
      `);

        // Remplacement des backslashes par des slashes dans le chemin d'image
        printers.forEach(printer => {
            if (printer.primary_image) {
                printer.primary_image = printer.primary_image.replace(/\\/g, '/').replace(/ /g, '-');
            }
        });

        res.status(200).json(printers);
    } catch (error) {
        logger.error(`Erreur lors de la récupération des imprimantes : ${error.message}`);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Récupérer une imprimante avec toutes ses images (l'image principale en premier)
const getPrinterById = async (req, res) => {
    const { id } = req.params;
    try {
        // Récupérer les détails de l'imprimante
        const [printers] = await db.query('SELECT * FROM printers WHERE id_printer = ?', [id]);
        if (printers.length === 0) throw new NotFoundError('Imprimante non trouvée');
        const printer = printers[0];

        // Récupérer toutes les images de l'imprimante avec l'image principale en premier
        const [images] = await db.query(`
        SELECT url 
        FROM images 
        WHERE id_printer = ? 
        ORDER BY is_primary DESC
      `, [id]);

        // Remplacement des backslashes par des slashes dans le chemin d'image
        printer.images = images.map(img => img.url.replace(/\\/g, '/').replace(/ /g, '%20'));

        // Récupérer les consommables compatibles pour l'imprimante
        const [compatibleConsumables] = await db.query(`
        SELECT c.* 
        FROM consumables c
        JOIN compatible_printers cp ON cp.id_consumable = c.id_consumable
        WHERE cp.id_printer = ?
      `, [id]);

        // Ajouter les consommables compatibles à l'objet de l'imprimante
        printer.compatibleConsumables = compatibleConsumables;

        res.status(200).json(printer);
    } catch (error) {
        logger.error(`Erreur lors de la récupération de l'imprimante : ${error.message}`);
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};


// Ajouter une nouvelle imprimante
const createPrinter = async (req, res) => {
    const { brand, product_series, model, reference, price, weight_kg, print_speed_ppm, scan_speed_ipm, copy_volume_per_month, color_support, supports_A3, supports_A4, connectivity, stock, short_description, detailed_description } = req.body;

    try {
        if (!brand || !model || !reference || !price) {
            throw new ValidationError('Les champs obligatoires sont manquants');
        }

        await db.query(
            'INSERT INTO printers (brand, product_series, model, reference, price, weight_kg, print_speed_ppm, scan_speed_ipm, copy_volume_per_month, color_support, supports_A3, supports_A4, connectivity, stock, short_description, detailed_description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [brand, product_series, model, reference, price, weight_kg, print_speed_ppm, scan_speed_ipm, copy_volume_per_month, color_support, supports_A3, supports_A4, connectivity, stock, short_description, detailed_description]
        );

        res.status(201).json({ message: 'Imprimante ajoutée avec succès' });
    } catch (error) {
        logger.error(`Erreur lors de l'ajout de l'imprimante : ${error.message}`);
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

// Mettre à jour une imprimante
const updatePrinter = async (req, res) => {
    const { id } = req.params;
    const { brand, product_series, model, reference, price, weight_kg, print_speed_ppm, scan_speed_ipm, copy_volume_per_month, color_support, supports_A3, supports_A4, connectivity, stock, short_description, detailed_description } = req.body;

    try {
        const [result] = await db.query(
            'UPDATE printers SET brand = ?, product_series = ?, model = ?, reference = ?, price = ?, weight_kg = ?, print_speed_ppm = ?, scan_speed_ipm = ?, copy_volume_per_month = ?, color_support = ?, supports_A3 = ?, supports_A4 = ?, connectivity = ?, stock = ?, short_description = ?, detailed_description = ? WHERE id_printer = ?',
            [brand, product_series, model, reference, price, weight_kg, print_speed_ppm, scan_speed_ipm, copy_volume_per_month, color_support, supports_A3, supports_A4, connectivity, stock, short_description, detailed_description, id]
        );

        if (result.affectedRows === 0) throw new NotFoundError('Imprimante non trouvée');
        res.status(200).json({ message: 'Imprimante mise à jour avec succès' });
    } catch (error) {
        logger.error(`Erreur lors de la mise à jour de l'imprimante : ${error.message}`);
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

// Supprimer une imprimante
const deletePrinter = async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query('DELETE FROM printers WHERE id_printer = ?', [id]);
        if (result.affectedRows === 0) throw new NotFoundError('Imprimante non trouvée');
        res.status(200).json({ message: 'Imprimante supprimée avec succès' });
    } catch (error) {
        logger.error(`Erreur lors de la suppression de l'imprimante : ${error.message}`);
        res.status(error.statusCode || 500).json({ message: error.message });
    }
};

module.exports = {
    getAllPrinters,
    getPrinterById,
    createPrinter,
    updatePrinter,
    deletePrinter,
};
