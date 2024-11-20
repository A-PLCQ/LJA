const { Op } = require('sequelize'); // Import Sequelize Operators

module.exports = (sequelize, DataTypes) => {
  const RefreshTokens = sequelize.define(
    'RefreshTokens',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [20, 512], // Longueur minimale et maximale pour le token
        },
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE', // Supprime les tokens si l'utilisateur est supprimé
      },
      ip_address: {
        type: DataTypes.STRING,
        allowNull: true,
      },      
      device_info: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      is_revoked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      expires_at: {
        type: DataTypes.DATE,
        allowNull: false,
        validate: {
          isDate: true, // Vérifie que c'est une date valide
        },
      },
    },
    {
      tableName: 'refresh_tokens',
      timestamps: true, // Gère createdAt et updatedAt automatiquement
      indexes: [
        {
          name: 'user_token_index',
          fields: ['user_id', 'token'], // Index composite pour accélérer les recherches
        },
      ],
      // hooks: {
      //   // Suppression automatique des tokens expirés
      //   beforeFind: async () => {
      //     try {
      //       await RefreshTokens.destroy({
      //         where: {
      //           expires_at: {
      //             [Op.lt]: new Date(), // Comparaison correcte pour les dates expirées
      //           },
      //         },
      //       });
      //     } catch (error) {
      //       console.error('Erreur lors de la suppression des tokens expirés :', error.message);
      //     }
      //   },
      // },
    }
  );

  // Méthode d'instance pour révoquer un token
  RefreshTokens.prototype.revoke = async function () {
    try {
      this.is_revoked = true;
      await this.save();
    } catch (error) {
      console.error('Erreur lors de la révocation du token :', error.message);
    }
  };

  return RefreshTokens;
};
