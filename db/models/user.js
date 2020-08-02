const { DataTypes, Model } = require('sequelize');

const userSchema = {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fullname: {
    type: DataTypes.STRING,
    allowNull: false
  },
  numPosts: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  numFollowers: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  numFollowing: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  averageLikes: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  averageComments: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  isPrivate: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
  },
  profilePicUrl: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  isBusinessAccount: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: false,
  },
  businessCategory: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  },
  businessEmail: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  },
  businessPhone: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  },
  businessAddress: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: null,
  },
  csrfToken: {
    type: DataTypes.STRING
  },
  countryCode: {
    type: DataTypes.STRING,
    allowNull: false
  },
  languageCode: {
    type: DataTypes.STRING,
    allowNull: false
  },
  locale: {
    type: DataTypes.STRING,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  }
};

class User extends Model {}

function initUser(sequelize) {
  User.init(userSchema, {
    sequelize,
    tableName: 'user',
    underscored: true,
  });
}

module.exports = {
  initUser,
  User,
};
