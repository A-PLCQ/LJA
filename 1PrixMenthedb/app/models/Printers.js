module.exports = (sequelize, DataTypes) => {
  const Printers = sequelize.define('Printers', {
    id_printer: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    product_series: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    reference: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    weight_kg: {
      type: DataTypes.DECIMAL(5, 2),
      allowNull: true, // Optionnel si non disponible
      validate: {
        min: 0,
      },
    },
    print_speed_ppm: {
      type: DataTypes.INTEGER,
      allowNull: true, // Optionnel si non applicable
    },
    scan_speed_ipm: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    copy_volume_per_month: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    color_support: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    supports_A3: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    supports_A4: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    connectivity: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    short_description: {
      type: DataTypes.TEXT,
      validate: {
        len: [0, 500],
      },
    },
    detailed_description: {
      type: DataTypes.TEXT,
    },
  }, {
    tableName: 'printers',
    timestamps: true,
    updatedAt: 'updated_at',
    createdAt: 'created_at',
    indexes: [
      {
        name: 'idx_printer_brand_model',
        fields: ['brand', 'model'],
      },
      {
        name: 'idx_printer_reference',
        fields: ['reference'],
      },
    ],
    hooks: {
      beforeSave: (printer) => {
        if (printer.stock < 0) {
          throw new Error('Stock cannot be negative.');
        }
      },
    },
  });

  return Printers;
};
