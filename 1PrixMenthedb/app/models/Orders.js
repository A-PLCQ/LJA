// Centralized module export format for Orders model
module.exports = (sequelize, DataTypes) => {
  const Orders = sequelize.define('Orders', {
    id_commande: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_utilisateur: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id_utilisateur',
      },
      onDelete: 'CASCADE',
    },
    montant_total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    date_commande: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    adresse_livraison: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    tableName: 'orders',
    timestamps: false,
    indexes: [
      {
        name: 'idx_id_utilisateur_orders',
        fields: ['id_utilisateur'],
      },
      {
        name: 'idx_status_orders',
        fields: ['status'],
      },
      {
        name: 'idx_date_commande_orders',
        fields: ['date_commande'],
      },
    ],
  });

  return Orders;
};
