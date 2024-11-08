// Centralized module export format for Payments model
module.exports = (sequelize, DataTypes) => {
  const Payments = sequelize.define('Payments', {
    id_paiement: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_commande: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Orders',
        key: 'id_commande',
      },
      onDelete: 'CASCADE',
    },
    montant: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    methode_paiement: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    date_paiement: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    statut: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    transaction_id: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
  }, {
    tableName: 'payments',
    timestamps: false,
    indexes: [
      {
        name: 'idx_id_commande_payments',
        fields: ['id_commande'],
      },
      {
        name: 'idx_statut_payments',
        fields: ['statut'],
      },
      {
        name: 'idx_date_paiement_payments',
        fields: ['date_paiement'],
      },
    ],
  });

  return Payments;
};
