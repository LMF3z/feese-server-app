const { getDateOfDate } = require('../../utils/orders.utils');
const {
  getLastDatePaymentComplete,
} = require('../../services/employees/employeesPayments.service');

const validateDatePaymentOfEmployeeSelected = async (req, res, next) => {
  const { employee_selected } = req.body;

  const lastDate = await getLastDatePaymentComplete(employee_selected[0].id);

  if (
    lastDate?.data?.last_date_complete_payment ===
    getDateOfDate(req.body.createdAt)
  ) {
    return res.json({
      msg: 'Empleado no puede ser asociado el dia de hoy.',
      success: false,
      data: [],
    });
  }

  next();

  try {
  } catch (error) {
    return res.json({
      msg: 'Error al verificar disponibilidad del empleado.',
      success: false,
      data: [],
    });
  }
};

module.exports.validateDatePaymentOfEmployeeSelected =
  validateDatePaymentOfEmployeeSelected;
