// Centralized module export format for CartItems model
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
    id_utilisateur: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id_utilisateur',
      },
      allowNull: true,
      onDelete: 'CASCADE',
    },
    id_printer: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Printers',
        key: 'id_printer',
      },
      allowNull: true,
      onDelete: 'CASCADE',
    },
    id_consumable: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Consumables',
        key: 'id_consumable',
      },
      allowNull: true,
      onDelete: 'CASCADE',
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
    timestamps: false,
    indexes: [
      {
        name: 'idx_id_utilisateur_cart_items',
        fields: ['id_utilisateur'],
      },
    ],
  });

  return CartItems;
};