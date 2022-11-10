const { Op } = require('sequelize');
const {
  paymentsTypes,
  paymentsModes,
} = require('../../constants/globalsConstants');
const paginationConstants = require('../../constants/paginationConstants');
const ModelEmployeePayment = require('../../models/employees/paymentsEmployees.model');
const ModelEmployee = require('../../models/employees/employee.model');
const { addDaysToDate } = require('../../utils/commonUtils');
const {
  getTotalAmountOfOrdersForEmployee,
} = require('../orders/orders.service');
const { getEmployeeByID, getEmployees } = require('./employees.service');
const { generateSequentialNumber } = require('../../utils/orders.utils');
const {
  getLocalDateTime,
  getOnlyDateFromNewDate,
} = require('../../utils/datesUtils');

const getAmountPayments = async (id) => {
  try {
    const lastIdPayment = await ModelEmployeePayment.findAll({
      where: {
        id_company: id,
      },
      attributes: ['id'],
      order: [['id', 'DESC']],
    });

    return lastIdPayment[0]?.dataValues ? lastIdPayment[0].dataValues.id : 0;
  } catch (error) {
    return {
      msg: 'Error al obtener numero de pagos.',
      success: false,
      data: error,
    };
  }
};

const generateNewNumberControl = async (id_company) => {
  const num_orders = await getAmountPayments(id_company);
  const seriesNum = generateSequentialNumber(num_orders + 1);
  const NewNumControl = `NP-${seriesNum}`;
  return NewNumControl;
};

const createNewEmployeePayment = async (data) => {
  let newPayment = {};

  try {
    // * buscamos el ultimo pago completo
    const lastPaymentComplete = await getLastDatePaymentComplete(
      data.id_employee
    );

    // * buscamos el ultimo pago adelanto
    const lastPaymentAdvance = await getLastDatePaymentAdvance(
      data.id_employee
    );

    // * verificar la ultima fecha de adelanto. Si el tipo de pago es adelanto y la fecha del ultimo adelanto coincide con la del dia actual no se puede registrar
    const currentDate = getOnlyDateFromNewDate(getLocalDateTime());

    if (
      lastPaymentAdvance?.data?.last_date_advance_payment === currentDate &&
      data?.payment_type === paymentsModes.advance
    ) {
      return {
        success: false,
        msg: 'No se pueden registrar adelantos con la misma fecha.',
        data: null,
      };
    }

    if (
      lastPaymentComplete?.data?.last_date_complete_payment === currentDate &&
      data?.payment_type === paymentsModes.complete
    ) {
      return {
        success: false,
        msg: 'No se pueden registrar pagos con la misma fecha.',
        data: null,
      };
    }

    newPayment = {
      ...data,
      last_date_complete_payment:
        data.payment_type === paymentsModes.complete
          ? data.date
          : lastPaymentComplete.data?.last_date_complete_payment
          ? lastPaymentComplete.data?.last_date_complete_payment
          : '2010-01-01',
      last_date_advance_payment:
        data.payment_type === paymentsModes.advance
          ? data.date
          : lastPaymentAdvance.data?.last_date_advance_payment
          ? lastPaymentAdvance.data?.last_date_advance_payment
          : '2010-01-01',
      createdAt: data.date,
    };

    const num_payment = await generateNewNumberControl(data.id_company);
    newPayment.num_payment = num_payment;

    const newEmployeePayment = new ModelEmployeePayment(newPayment);

    const saved = await newEmployeePayment.save();

    return {
      success: true,
      msg: 'Pago registrado exitosamente.',
      data: null,
    };
  } catch (error) {
    console.log('Error al registrar pago a empleado ----->', error);
    return {
      success: false,
      msg: 'Error al registrar pago a empleado ',
      data: [],
    };
  }
};

const getLastDatePaymentComplete = async (id_employee) => {
  try {
    const lastPayment = await ModelEmployeePayment.findOne({
      where: {
        id_employee,
        payment_type: paymentsModes.complete,
      },
      order: [['id', 'DESC']],
    });

    return {
      msg: 'Ultimo pago completo de empleado',
      success: true,
      data: lastPayment,
    };
  } catch (error) {
    return {
      msg: 'Error al buscar último pago completo.',
      success: false,
      data: error,
    };
  }
};

const getLastDatePaymentAdvance = async (id_employee) => {
  try {
    const lastPayment = await ModelEmployeePayment.findOne({
      where: {
        id_employee,
        payment_type: paymentsModes.advance,
      },
      order: [['id', 'DESC']],
    });

    return {
      msg: 'Ultimo pago adelantado de empleado',
      success: true,
      data: lastPayment,
    };
  } catch (error) {
    return {
      msg: 'Error al buscar último pago completo.',
      success: false,
      data: error,
    };
  }
};

const getListLastPaymentAdvanceByDateRange = async (
  id_employee,
  initialDate,
  finishDate
) => {
  try {
    const lastPayment = await ModelEmployeePayment.findAll({
      where: {
        id_employee,
        payment_type: paymentsModes.advance,
        last_date_advance_payment: {
          [Op.between]: [initialDate, finishDate],
        },
      },
    });

    return {
      msg: 'Lista de adelantos',
      success: true,
      data: lastPayment,
    };
  } catch (error) {
    return {
      msg: 'Error al buscar lista de adelantos.',
      success: false,
      data: error,
    };
  }
};

const getDataEmployeePaymentServices = async (id_employee, actualDate) => {
  let data = {};

  try {
    // * obtener la ultima fecha de pago completo
    const lastPaymentComplete = await getLastDatePaymentComplete(id_employee);

    // * obtener la ultima fecha de pago adelanto
    const lastPaymentAdvance = await getLastDatePaymentAdvance(id_employee);

    // * obtenemos datos del empleado
    const employee = await getEmployeeByID(id_employee);

    // * obtener el total a pagar
    // * buscamos el total de las ordenes asociadas al empleado
    const ordersAssociatedToEmployee = await getTotalAmountOfOrdersForEmployee(
      id_employee,
      lastPaymentComplete?.data?.last_date_complete_payment
        ? addDaysToDate(
            lastPaymentComplete?.data?.last_date_complete_payment,
            1
          )
        : '2010-01-01',
      lastPaymentComplete?.data?.last_date_complete_payment === actualDate
        ? addDaysToDate(actualDate, 1)
        : actualDate
    );

    const totalOrders = getTotalPaymentInOrders(
      ordersAssociatedToEmployee.data
    );

    const totalToPay = getUnpaidForEmployeeByPercentPayment(
      totalOrders,
      employee.data.payment_amount
    );

    // * buscamos adelantos
    const advances = await getListLastPaymentAdvanceByDateRange(
      id_employee,
      lastPaymentComplete.data?.last_date_complete_payment
        ? addDaysToDate(lastPaymentComplete.data.last_date_complete_payment, 1)
        : '2010-01-01',
      actualDate
    );

    const totalAmountAdvances = getTotalAdvancesInOrders(advances.data);

    // * buscamos lista de pagos.

    data = { ...employee.data.dataValues };
    data.lastPaymentComplete = lastPaymentComplete.data;
    data.lastPaymentAdvance = lastPaymentAdvance.data;
    // data.ordersAssociatedToEmployee = ordersAssociatedToEmployee.data;
    data.totalAmountAdvances = totalAmountAdvances;

    // * ---------------------------------------------------------------

    if (employee.data.payment_type === paymentsTypes.fixed_payment) {
      data.totalGenerate = totalToPay;
      data.totalToPay = employee.data.payment_amount - totalAmountAdvances;

      return {
        msg: 'data pago',
        success: true,
        data: data,
      };
    }

    // * --------------------------------------------------------------

    data.totalGenerate = totalToPay;
    data.totalToPay =
      totalToPay > 0 ? (totalToPay - totalAmountAdvances).toFixed(2) : 0;

    return {
      msg: 'data pago',
      success: true,
      data: data,
    };
  } catch (error) {
    return {
      msg: 'Error al obtener datos del pago.',
      success: false,
      data: error,
    };
  }
};

const getPaymentsOfCompanyByRangeDatePagination = async (options) => {
  const { id_company, initialDate, finishDate, flag, offset } = options;

  let paymentsList = [];
  let result = [];

  try {
    if (flag === 'paid') {
      paymentsList = await ModelEmployeePayment.findAndCountAll({
        where: {
          id_company,
          payment_type: 'complete',
          createdAt: {
            [Op.between]: [initialDate, finishDate],
          },
        },
        order: [['id', 'DESC']],
        offset: +offset,
        limit: paginationConstants.limit,
      });
    } else if (flag === 'unPayment') {
      const unPaymentData = await getAllUnpaidEmployee(
        +id_company,
        null,
        +offset,
        finishDate
      );

      return {
        msg: 'Lista de pagos de la empresa',
        success: true,
        data: unPaymentData.data,
      };
    } else {
      paymentsList = await ModelEmployeePayment.findAndCountAll({
        where: {
          id_company,
          createdAt: {
            [Op.between]: [initialDate, finishDate],
          },
        },
        order: [['id', 'DESC']],
        offset: +offset,
        limit: paginationConstants.limit,
      });
    }

    // * buscamos los datos de los empleados
    if (paymentsList?.rows?.length > 0) {
      for (const payment of paymentsList.rows) {
        const employee = await ModelEmployee.findOne({
          where: {
            id: payment.dataValues.id_employee,
          },
        });

        result.push({ ...payment.dataValues, employee });
      }
    }

    const data = {
      count: paymentsList.count,
      data: result,
    };

    return {
      msg: 'Lista de pagos de la empresa',
      success: true,
      data: data,
    };
  } catch (error) {
    return {
      msg: 'Error al obtener lista de pagos de la empresa',
      success: false,
      data: [],
    };
  }
};

const getAllPaymentsOfCompanyByRangeDate = async (options) => {
  const { id_company, initialDate, finishDate } = options;

  try {
    const paymentsList = await ModelEmployeePayment.findAll({
      where: {
        id_company,
        createdAt: {
          [Op.between]: [initialDate, finishDate],
        },
      },
    });

    return {
      msg: 'Lista de pagos de la empresa',
      success: true,
      data: paymentsList,
    };
  } catch (error) {
    return {
      msg: 'Error al obtener lista de pagos de la empresa',
      success: false,
      data: [],
    };
  }
};

const getAllPaymentsOfEmployeePaginated = async (options) => {
  const { id_employee, offset } = options;

  try {
    const paymentsList = await ModelEmployeePayment.findAndCountAll({
      where: {
        id_employee,
      },
      order: [['id', 'DESC']],
      offset: +offset,
      limit: paginationConstants.limit,
    });

    return {
      msg: 'Lista de pagos de la empresa',
      success: true,
      data: paymentsList,
    };
  } catch (error) {
    return {
      msg: 'Error al obtener lista de pagos de la empresa',
      success: false,
      data: [],
    };
  }
};

const getAllUnpaidEmployee = async (
  id_company,
  id_branches,
  offset,
  currentDate
) => {
  try {
    // * obtenemos todos los empleados
    const employeesList = await getEmployees({
      id_company,
      id_branches,
      offset,
    });

    const resultForPayment = [];

    for (const employee of employeesList.data.rows) {
      const forPayment = await getDataEmployeePaymentServices(
        employee.id,
        currentDate
      );

      if (+forPayment.data.totalToPay > 0) {
        forPayment.data.payment_type = 'unPayment';
        resultForPayment.push(forPayment.data);
      }
    }

    return {
      msg: 'Lista de empleados',
      success: true,
      data: {
        count: employeesList.data.count,
        data: resultForPayment,
      },
    };
  } catch (error) {
    return {
      msg: 'Error al buscar pagos por cancelar.',
      success: false,
      data: [],
    };
  }
};

const getDetailsEmployeePayment = async (id) => {
  try {
    const detailsPayment = await ModelEmployeePayment.findOne({
      where: {
        id: id,
      },
    });

    const data = detailsPayment.dataValues;

    const employee = await getEmployeeByID(data.id_employee);

    data.employee = employee.data;

    return {
      msg: 'Detalles del pago',
      success: true,
      data: detailsPayment,
    };
  } catch (error) {
    return {
      msg: 'Error al buscar detalles del pago.',
      success: false,
      data: error,
    };
  }
};

module.exports.createNewEmployeePayment = createNewEmployeePayment;
module.exports.getLastDatePaymentComplete = getLastDatePaymentComplete;
module.exports.getLastDatePaymentAdvance = getLastDatePaymentAdvance;
module.exports.getDataEmployeePaymentServices = getDataEmployeePaymentServices;
module.exports.getPaymentsOfCompanyByRangeDatePagination =
  getPaymentsOfCompanyByRangeDatePagination;
module.exports.getAllPaymentsOfCompanyByRangeDate =
  getAllPaymentsOfCompanyByRangeDate;
module.exports.getAllPaymentsOfEmployeePaginated =
  getAllPaymentsOfEmployeePaginated;
module.exports.getAllUnpaidEmployee = getAllUnpaidEmployee;
module.exports.getDetailsEmployeePayment = getDetailsEmployeePayment;

// * utils functions
const getTotalPaymentInOrders = (arr) =>
  arr.reduce((acc, el) => acc + +el.total_payment, 0);

const getTotalAdvancesInOrders = (arr) =>
  arr.reduce((acc, el) => acc + +el.payment_amount, 0);

const getUnpaidForEmployeeByPercentPayment = (total_orders, percent) => {
  const result = (total_orders * +percent) / 100;
  return result;
};

module.exports.getTotalAdvancesInOrders = getTotalAdvancesInOrders;
module.exports.getTotalPaymentInOrders = getTotalPaymentInOrders;
