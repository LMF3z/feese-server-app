const { Op } = require('sequelize');
const { connectionDB } = require('../../config/mysql');
const sequelize = connectionDB.sequelize;
const paginationConstants = require('../../constants/paginationConstants');
const ModelOrders = require('../../models/orders/order.model');
const ModelEmployeeOrders = require('../../models/orders/orderEmployees.model');
const {
  generateSequentialNumber,
  getHourOfDate,
} = require('../../utils/orders.utils');
const ordersUtils = require('../../utils/orders.utils');
const { getClientByID } = require('../clients/clients.services');
const employeesServices = require('../employees/employeesPayments.service');
const servicesServices = require('../services/services.service');
const expendituresServices = require('../expenditures/expenditures.service');

const getAmountOrders = async (id) => {
  try {
    const lastIdOrder = await ModelOrders.findAll({
      where: {
        id_company: id,
      },
      attributes: ['id'],
      order: [['id', 'DESC']],
    });

    return lastIdOrder[0]?.dataValues ? lastIdOrder[0].dataValues.id : 0;
  } catch (error) {
    return {
      msg: 'Error al obtener numero de ordenes.',
      success: false,
      data: error,
    };
  }
};

const generateNewNumberControl = async (id_company) => {
  const num_orders = await getAmountOrders(id_company);
  const seriesNum = generateSequentialNumber(num_orders + 1);
  const NewNumControl = `NO-${seriesNum}`;
  return NewNumControl;
};

const existCashOnBox = async ({ id_company, actualDate }) => {
  try {
    const total = await ModelOrders.findAll({
      where: {
        id_company: id_company,
        createdAt: actualDate,
        state_null: false,
      },
      attributes: [
        [sequelize.fn('sum', sequelize.col('cash')), 'cashTotal'],
        [sequelize.fn('sum', sequelize.col('cashChange')), 'change'],
      ],
    });

    const enableCash =
      total[0].dataValues.cashTotal - total[0].dataValues.change;

    return {
      msg: 'Total de efectivo en caja',
      success: true,
      data: enableCash.toFixed(2),
    };
  } catch (error) {
    return {
      msg: 'Error al buscar efectivo',
      success: false,
      data: [],
    };
  }
};

const getTotalEnableCash = async (data) => {
  try {
    const existCash = await existCashOnBox({
      id_company: data.id_company,
      actualDate: data.createdAt,
    });

    const expendituresTotal =
      await expendituresServices.getTotalExpenditureByRangeDate({
        id_company: data.id_company,
        initialDate: data.createdAt,
        finishDate: data.createdAt,
      });

    const totalCashEnable = +existCash.data - +expendituresTotal.data;

    return {
      msg: 'Total de efectivo disponible',
      success: true,
      data: totalCashEnable > 0 ? totalCashEnable.toFixed(2) : 0,
    };
  } catch (error) {
    return {
      msg: 'Error al buscar efectivo disponible',
      success: false,
      data: [],
    };
  }
};

const saveNewOrder = async (data) => {
  try {
    const newNumControl = await generateNewNumberControl(data.id_company);

    const dataOrder = {
      id_company: data.id_company,
      id_branches: data.id_branches,
      user_id: data.user_id,
      num_control: newNumControl,
      total_payment: data.total_payment,
      client_selected: data.client_selected.id,
      cash: data.cash,
      card: data.card,
      transfer: data.transfer,
      cashChange: data.cashChange,
      hour: getHourOfDate(data.createdAt),
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    };

    const newOrder = new ModelOrders(dataOrder);
    const orderSaved = await newOrder.save();

    return {
      msg: 'Orden generada exitosamente.',
      success: true,
      data: orderSaved.dataValues,
    };
  } catch (error) {
    return {
      msg: 'Error al asociar empleado a la orden.',
      success: false,
      data: null,
    };
  }
};

const getOrderByNumControl = async (num_control) => {
  try {
    const orderData = await ModelOrders.findOne({
      where: {
        num_control,
      },
    });

    const data = orderData.dataValues;

    // * buscamos datos del cliente
    const client = await getClientByID(data.client_selected);
    data.client = client.data;

    // * buscamos datos de los servicios
    const services = await servicesServices.getAllServicesAssociatedToOrder(
      num_control
    );

    data.services = services.data;

    return {
      msg: `Orden numero ${num_control}`,
      success: true,
      data: data,
    };
  } catch (error) {
    return {
      msg: 'Error al buscar orden',
      success: false,
      data: [],
    };
  }
};

const getOrderById = async (id) => {
  try {
    const orderData = await ModelOrders.findOne({
      where: {
        id,
      },
    });

    const data = orderData.dataValues;

    // * buscamos datos del cliente
    const client = await getClientByID(data.client_selected);
    data.client = client.data;

    return {
      msg: `Orden numero ${num_control}`,
      success: true,
      data: data,
    };
  } catch (error) {
    return {
      msg: 'Error al buscar orden',
      success: false,
      data: [],
    };
  }
};

const getOrdersListByRangeDate = async (data) => {
  const { id_company, initialDate, finishDate, offset } = data;

  try {
    const { count, rows } = await ModelOrders.findAndCountAll({
      where: {
        id_company: id_company,
        createdAt: {
          [Op.between]: [initialDate, finishDate],
        },
      },
      order: [['id', 'DESC']],
      offset: offset,
      limit: paginationConstants.limit,
    });

    const ordersList = { count, rows };

    // * buscamos lista de pagos en el rango de fechas
    const payments = await employeesServices.getAllPaymentsOfCompanyByRangeDate(
      {
        id_company,
        initialDate,
        finishDate,
      }
    );
    const totalPayments = payments.data.reduce(
      (acc, el) => acc + +el.payment_amount,
      0
    );

    ordersList.totalPayments =
      totalPayments > 0 ? totalPayments.toFixed(2) : totalPayments;

    // * buscamos totales de gastos para el rango de fechas
    const expendituresTotal =
      await expendituresServices.getTotalExpenditureByRangeDate({
        id_company,
        initialDate,
        finishDate,
      });

    ordersList.expendituresTotal = expendituresTotal.data;

    // * buscamos totales de ordenes para el rango de fechas
    const totalsByTypePayment = ordersUtils.getTotalByTypePayment(rows);
    const totalPaymentsOrders = Object.values(totalsByTypePayment).reduce(
      (acc, el) => +acc + +el,
      0
    );

    const totalGenerated =
      totalPaymentsOrders -
      +ordersList.totalPayments -
      +ordersList.expendituresTotal;

    ordersList.totalPaymentsOrders =
      totalGenerated > 0 ? totalGenerated.toFixed(2) : totalGenerated;

    return {
      msg: 'Lista de ordenes',
      success: true,
      data: ordersList,
    };
  } catch (error) {
    return {
      msg: 'Error al buscar ordenes',
      success: false,
      data: [],
    };
  }
};

const annularOrder = async (id) => {
  try {
    await ModelOrders.update(
      {
        state_null: true,
      },
      {
        where: {
          id: id,
        },
      }
    );

    return {
      msg: 'Orden anulada exitosamente',
      success: true,
      data: {},
    };
  } catch (error) {
    return {
      msg: 'Error al buscar orden',
      success: false,
      data: [],
    };
  }
};

// * payments
const getTotalAmountOfOrdersForEmployee = async (
  id_employee,
  initialDate,
  finishDate
) => {
  const ordersAssociatedToEmployee = [];

  try {
    const employeeOrders = await ModelEmployeeOrders.findAll({
      where: {
        id_employee,
        createdAt: {
          [Op.between]: [initialDate ? initialDate : '2010-01-01', finishDate],
        },
      },
    });

    for (const order of employeeOrders) {
      const totalAmountFromOrders = await ModelOrders.findOne({
        where: {
          num_control: order.dataValues.num_control,
          state_null: false,
        },
      });

      totalAmountFromOrders &&
        ordersAssociatedToEmployee.push(totalAmountFromOrders?.dataValues);
    }

    return {
      msg: 'ordenes asociadas al empleado',
      success: true,
      data: ordersAssociatedToEmployee,
    };
  } catch (error) {
    return {
      msg: 'Error al buscar ordenes asociadas al empleado',
      success: false,
      data: [],
    };
  }
};

module.exports.getAmountOrders = getAmountOrders;
module.exports.generateNewNumberControl = generateNewNumberControl;
module.exports.existCashOnBox = existCashOnBox;
module.exports.getTotalEnableCash = getTotalEnableCash;
module.exports.saveNewOrder = saveNewOrder;
module.exports.getOrderByNumControl = getOrderByNumControl;
module.exports.getOrderById = getOrderById;
module.exports.getOrdersListByRangeDate = getOrdersListByRangeDate;
module.exports.annularOrder = annularOrder;
module.exports.getTotalAmountOfOrdersForEmployee =
  getTotalAmountOfOrdersForEmployee;
