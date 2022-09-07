const express = require('express');
const router = express.Router();
// middlewares
const validateFormatEmployee = require('../../middlewares/employee/validateEmployeeFormat.middleware');
const validateToken = require('../../middlewares/security/validateToken');
// controllers
const employeesController = require('../../controllers/employees/employees.controller');
const {
  saveNewEmployeePayment,
  getDataLastEmployeePayment,
  getPaymentsHistoryPagination,
  getDetailsEmployeePaymentController,
  getEmployeePaymentsHistory,
} = require('../../controllers/employees/employeePayment.controller');
const {
  validateStateMembership,
} = require('../../middlewares/security/validateMembershipState.middleware');

router.post(
  '/add-new-employee',
  validateFormatEmployee.validateRegisterEmployee,
  validateToken.validateToken,
  validateStateMembership,
  employeesController.createEmployee
);

router.get(
  '/get-employees-list',
  validateToken.validateToken,
  employeesController.getEmployees
);

router.get(
  '/get-employee-by-id',
  validateToken.validateToken,
  employeesController.getEmployeeByIdFromDb
);

router.get(
  '/get-all-matches-employees',
  validateToken.validateToken,
  employeesController.getEmployeesByQueryFromDB
);

router.put(
  '/update-employee',
  validateToken.validateToken,
  validateStateMembership,
  employeesController.updateEmployee
);

router.delete(
  '/delete-employee',
  validateToken.validateToken,
  validateStateMembership,
  employeesController.deleteEmployee
);

// ************************ employees payments

router.post(
  '/create-new-employee-payment',
  validateToken.validateToken,
  validateStateMembership,
  saveNewEmployeePayment
);

router.get(
  '/get-data-employee-payment',
  validateToken.validateToken,
  getDataLastEmployeePayment
);

router.get(
  '/get-details-employee-payment',
  validateToken.validateToken,
  getDetailsEmployeePaymentController
);

router.get(
  '/get-history-payments-company',
  validateToken.validateToken,
  getPaymentsHistoryPagination
);

router.get(
  '/get-history-payments-employee',
  validateToken.validateToken,
  getEmployeePaymentsHistory
);

// ************************ users company
router.get(
  '/get-all-users-company',
  validateToken.validateToken,
  employeesController.getAllUsersCompany
);

router.post(
  '/create-new-user-company',
  validateToken.validateToken,
  validateFormatEmployee.validateFormatNewUserForCompany,
  validateStateMembership,
  employeesController.createUserCompany
);

router.delete(
  '/delete-user-company',
  validateToken.validateToken,
  validateStateMembership,
  employeesController.deleteUserCompany
);

// ************************ Reports

// router.get(
//   '/get-report-payments-by-type-and-date-range',
//   // validateToken.validateToken,
//   getReportPaymentsByTypeAndDateRange
// );

module.exports = router;
