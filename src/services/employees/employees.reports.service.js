const {
  getAllPaymentsOfCompanyByRangeDate,
} = require('./employeesPayments.service');

const getReportPaymentsByTypeAndDateRangeService = async (data) => {
  // * obtenemos todas las pagos dentro del rango de fechas
  const paymentsList = await getAllPaymentsOfCompanyByRangeDate(data);
  return paymentsList;
};

module.exports.getReportPaymentsByTypeAndDateRangeService =
  getReportPaymentsByTypeAndDateRangeService;
