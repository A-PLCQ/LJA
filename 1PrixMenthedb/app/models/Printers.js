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
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    print_speed_ppm: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    scan_speed_ipm: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    copy_volume_per_month: {
      type: DataTypes.STRING,
      allowNull: false,
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
    },
    detailed_description: {
      type: DataTypes.TEXT,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.Sequelize.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: sequelize.Sequelize.NOW,
    },
  }, {
    tableName: 'printers',
    timestamps: true,
    updatedAt: 'updated_at', // Use the custom field for updated timestamp
    createdAt: 'created_at', // Use the custom field for created timestamp
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
      beforeSave: (printer, options) => {
        // Ensure the stock is non-negative before saving
        if (printer.stock < 0) {
          throw new Error('Stock cannot be negative.');
        }
      },
    },
  });

  return Printers;
};
