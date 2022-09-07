const {
  saveNewOrder,
  getOrderByNumControl,
  getOrdersListByRangeDate,
  annularOrder,
  getTotalEnableCash,
} = require('../../services/orders/orders.service');
const employeesServices = require('../../services/employees/employees.service');
const servicesServices = require('../../services/services/services.service');
const { getDateOfDate } = require('../../utils/orders.utils');

const createOrder = async (req, res) => {
  const { employee_selected, services_selected } = req.body;
  const body = req.body;

  // * step one -> save order and generate control number
  const newOrder = await saveNewOrder(body);

  if (!newOrder.success) {
    console.log('Error new oder ----------------->', newOrder);
    return res.json(newOrder);
  }

  // * step two -> associate employees to order
  const associatedEmployee = await employeesServices.associateEmployeeToOrder(
    employee_selected,
    newOrder.data.num_control,
    newOrder.data.createdAt
  );

  if (!associatedEmployee.success) {
    console.log(
      'Error asociar empleado ----------------->',
      associatedEmployee
    );
    return res.json(associatedEmployee);
  }

  // * step three -> associate service to order
  const associatedServices = await servicesServices.associateServicesToOrder(
    services_selected,
    newOrder.data.num_control,
    newOrder.data.createdAt
  );

  if (!associatedServices.success) {
    console.log(
      'Error asociar servicio ----------------->',
      associatedServices
    );
    return res.json(associatedServices);
  }

  body.num_control = newOrder.data.num_control;

  res.json({
    msg: 'Orden generada exitosamente. Espere por favor...',
    success: true,
    data: body,
  });
};

const getOrderDataByNumControl = async (req, res) => {
  const { num_control } = req.query;
  const order = await getOrderByNumControl(num_control);
  res.json(order);
};

const getOrdersListByRangeDateFromDB = async (req, res) => {
  const { id_company, initialDate, finishDate, offset } = req.query;
  const orders = await getOrdersListByRangeDate({
    id_company: +id_company,
    initialDate,
    finishDate,
    offset: +offset,
  });
  res.json(orders);
};

const annularOrderController = async (req, res) => {
  const { id } = req.query;
  const nullified = await annularOrder(id);
  res.json(nullified);
};

const getEnableCash = async (req, res) => {
  const { id_company, date } = req.query;

  const dateFormate = getDateOfDate(date);

  const enabled = await getTotalEnableCash({
    id_company: +id_company,
    createdAt: dateFormate,
  });
  res.json(enabled);
};

module.exports.createOrder = createOrder;
module.exports.getOrderDataByNumControl = getOrderDataByNumControl;
module.exports.getOrdersListByRangeDateFromDB = getOrdersListByRangeDateFromDB;
module.exports.annularOrderController = annularOrderController;
module.exports.getEnableCash = getEnableCash;
