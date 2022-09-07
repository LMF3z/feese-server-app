const { DataTypes } = require('sequelize');
const { connectionDB } = require('../../config/mysql');

const UsersForCompany = connectionDB.sequelize.define(
  'UsersForCompany',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    id_company: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    id_branches: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    // id_employee: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false,
    // },
    alias_user_company: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email_user_company: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    role_user_company: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password_user_company: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: true }
);

module.exports = UsersForCompany;
