module.exports = (sequelize, DataTypes) => {
  const Payments = sequelize.define('Payments', {
    id_paiement: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_commande: {
      type: DataTypes.INTEGER,
      allowNull: false, // Mise à jour : Une commande est toujours nécessaire
      references: {
        model: 'Orders', // La table Orders doit avoir un champ id_commande
        key: 'id_commande',
      },
      onDelete: 'CASCADE',
    },
    montant: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0, // Validation : Le montant doit être positif
      },
    },
    methode_paiement: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [3, 50], // Longueur minimale et maximale
      },
    },
    date_paiement: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    statut: {
      type: DataTypes.ENUM('en attente', 'validé', 'échec'),
      allowNull: false,
      defaultValue: 'en attente', // Statut par défaut
    },
    transaction_id: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
  }, {
    tableName: 'payments',
    timestamps: true, // Active automatiquement createdAt et updatedAt
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
