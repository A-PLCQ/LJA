module.exports = (sequelize, DataTypes) => {
  const Images = sequelize.define('Images', {
    id_image: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_printer: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Printers',
        key: 'id_printer',
      },
    },
    id_consumable: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Consumables',
        key: 'id_consumable',
      },
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isUrl: true, // Validation pour s'assurer que le champ est une URL valide
      },
    },
    is_primary: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  }, {
    tableName: 'images',
    timestamps: true, // Sequelize gère createdAt et updatedAt
    indexes: [
      {
        name: 'idx_id_printer_images',
        fields: ['id_printer'],
      },
      {
        name: 'idx_id_consumable_images',
        fields: ['id_consumable'],
      },
    ],
    validate: {
      eitherPrinterOrConsumable() {
        if ((this.id_printer && this.id_consumable) || (!this.id_printer && !this.id_consumable)) {
          throw new Error('Either id_printer or id_consumable must be set, but not both.');
        }
      },
    },
  });

  return Images;
};
