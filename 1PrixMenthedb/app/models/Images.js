// Centralized module export format for Images model
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
      onDelete: 'CASCADE',
    },
    id_consumable: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Consumables',
        key: 'id_consumable',
      },
      onDelete: 'CASCADE',
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    is_primary: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'images',
    timestamps: false,
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
