const { DataTypes, Model } = require('sequelize');

const postSchema = {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: 'User'
  },
  shortcode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  url: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  numLikes: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  numComments: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  isVideo: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  videoViewCount: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  takenAtTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  caption: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  location: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: null
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


class Post extends Model {}


function initPost(sequelize) {
  Post.init(postSchema, {
    sequelize,
    tableName: 'post',
    underscored: true,
  });
}

module.exports = {
  initPost,
  Post
};
