const { DataTypes } = require('sequelize');
const { connectionDB } = require('../../config/mysql');

const Employees = connectionDB.sequelize.define(
  'Employees',
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name_employee: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name_employee: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    identification_employee: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    phone_employee: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    id_company: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    id_branches: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    payment_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    payment_amount: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
  },
  { timestamps: true }
);

module.exports = Employees;
