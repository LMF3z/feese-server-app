const { DataTypes } = require('sequelize');
const { connectionDB } = require('../../config/mysql');

const Users = new connectionDB.sequelize.define(
  'Users',
  {
    name_user: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name_user: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_access: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isUser: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    id_company: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_branch: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
  },
  { timestamps: true }
);

module.exports = Users;
