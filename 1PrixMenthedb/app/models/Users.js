module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    'Users',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      nom: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      prenom: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      mot_de_passe: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [8, 100], // Validation de longueur
        },
      },
      telephone: {
        type: DataTypes.STRING,
        allowNull: true,
        validate: {
          is: /^[0-9+]{9,15}$/, // Numéro de téléphone (9 à 15 chiffres)
        },
      },
      adresse: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      siret: {
        type: DataTypes.STRING(14),
        allowNull: true,
        validate: {
          is: /^[0-9]{14}$/, // Validation d'un numéro SIRET (14 chiffres)
        },
      },
      role: {
        type: DataTypes.ENUM('user', 'manager', 'admin'),
        defaultValue: 'user',
      },
      last_login: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      reset_code: {
        type: DataTypes.STRING(6),
        allowNull: true,
      },
      reset_code_expiry: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'users',
      timestamps: true, // Sequelize gère automatiquement createdAt et updatedAt
    }
  );

  return Users;
};
