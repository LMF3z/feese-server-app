const {
  getReportPaymentsByTypeAndDateRangeService,
} = require('../../services/employees/employees.reports.service');
const {
  createNewEmployeePayment,
  getDataEmployeePaymentServices,
  getPaymentsOfCompanyByRangeDatePagination,
  getDetailsEmployeePayment,
  getAllPaymentsOfEmployeePaginated,
} = require('../../services/employees/employeesPayments.service');

const saveNewEmployeePayment = async (req, res) => {
  const saved = await createNewEmployeePayment(req.body);
  res.json(saved);
};

const getDataLastEmployeePayment = async (req, res) => {
  const { id_employee, actualDate } = req.query;
  const data = await getDataEmployeePaymentServices(id_employee, actualDate);
  res.json(data);
};

const getPaymentsHistoryPagination = async (req, res) => {
  const { id_company, initialDate, finishDate, flag, offset } = req.query;
  const historyData = await getPaymentsOfCompanyByRangeDatePagination({
    id_company,
    initialDate,
    finishDate,
    flag,
    offset,
  });
  res.json(historyData);
};

const getDetailsEmployeePaymentController = async (req, res) => {
  const { id } = req.query;
  const detailsPayment = await getDetailsEmployeePayment(id);
  res.json(detailsPayment);
};

const getEmployeePaymentsHistory = async (req, res) => {
  const { id_employee, offset } = req.query;
  const paymentsList = await getAllPaymentsOfEmployeePaginated({
    id_employee,
    offset,
  });

  res.json(paymentsList);
};

const getReportPaymentsByTypeAndDateRange = async (req, res) => {
  const { id_company, initialDate, finishDate } = req.query;
  const reportsData = await getReportPaymentsByTypeAndDateRangeService({
    id_company,
    initialDate,
    finishDate,
  });
  res.json(reportsData);
};

module.exports.saveNewEmployeePayment = saveNewEmployeePayment;
module.exports.getDataLastEmployeePayment = getDataLastEmployeePayment;
module.exports.getPaymentsHistoryPagination = getPaymentsHistoryPagination;
module.exports.getDetailsEmployeePaymentController =
  getDetailsEmployeePaymentController;
module.exports.getEmployeePaymentsHistory = getEmployeePaymentsHistory;
module.exports.getReportPaymentsByTypeAndDateRange =
  getReportPaymentsByTypeAndDateRange;
