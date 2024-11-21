module.exports = (sequelize, DataTypes) => {
  const CartItems = sequelize.define('CartItems', {
    id_cart_item: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    session_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users', // Vérifie que le modèle "Users" est bien défini comme "User" dans index.js
        key: 'id',
      },
      allowNull: true,
    },
    id_printer: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Printers',
        key: 'id_printer',
      },
      allowNull: true,
    },
    id_consumable: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Consumables',
        key: 'id_consumable',
      },
      allowNull: true,
    },
    quantite: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    version: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    date_ajout: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
    tableName: 'cart_items',
    timestamps: true,
    indexes: [
      {
        name: 'idx_user_id_cart_items',
        fields: ['user_id'],
      },
      {
        name: 'idx_id_printer_cart_items',
        fields: ['id_printer'],
      },
      {
        name: 'idx_id_consumable_cart_items',
        fields: ['id_consumable'],
      },
    ],
  });
  
  return CartItems;
};
