import { DataTypes, Model, Sequelize } from 'sequelize';

const userSchema = {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fullname: {
    type: DataTypes.STRING,
    allowNull: false,
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
    type: DataTypes.STRING,
  },
  countryCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  languageCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  locale: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
};

export class User extends Model {
  public readonly id: string;
  public readonly username: string;
  public readonly fullname: string;
  public readonly numPosts: number;
  public readonly numFollowers: number;
  public readonly numFollowing: number;
  public readonly averageLikes: number;
  public readonly averageComments: number;
  public readonly isPrivate: boolean;
  public readonly isVerified: boolean;
  public readonly profilePicUrl: string;
  public readonly isBusinessAccount: boolean;
  public readonly businessCategory: string;
  public readonly businessEmail: string;
  public readonly businessPhone: string;
  public readonly businessAddress: JSON;
  public readonly csrfToken: string;
  public readonly countryCode: string;
  public readonly languageCode: string;
  public readonly locale: string;
}

export function initUser(sequelize: Sequelize) {
  User.init(userSchema, {
    sequelize,
    tableName: 'user',
    underscored: true,
  });
}
