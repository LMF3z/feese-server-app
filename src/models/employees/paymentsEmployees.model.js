const { DataTypes } = require('sequelize');
const { connectionDB } = require('../../config/mysql');

const PaymentsEmployees = connectionDB.sequelize.define(
  'PaymentsEmployees',
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
    num_payment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    id_employee: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    payment_amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    payment_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_date_complete_payment: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    last_date_advance_payment: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
  },
  { timestamps: false }
);

module.exports = PaymentsEmployees;
