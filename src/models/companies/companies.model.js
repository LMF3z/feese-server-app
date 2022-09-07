const { DataTypes } = require('sequelize');
const { connectionDB } = require('../../config/mysql');

const Company = connectionDB.sequelize.define(
  'Companies',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    logo_company: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name_company: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    address_company: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    type_document_company: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    document_company: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email_company: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password_company: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isCompany: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

    // member
  },
  { timestamps: true }
);

module.exports = Company;
