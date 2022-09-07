const employeesService = require('../../services/employees/employees.service');
const {
  getEmployeeByID,
} = require('../../services/employees/employees.service');

module.exports.createEmployee = async (req, res) => {
  const created = await employeesService.createNewEmployee(req.body);
  res.json(created);
};

module.exports.getEmployees = async (req, res) => {
  const { id_company, id_branches, offset } = req.query;
  const list = await employeesService.getEmployees({
    id_company,
    id_branches,
    offset: +offset,
  });

  res.json(list);
};

module.exports.getEmployeeByIdFromDb = async (req, res) => {
  const { id } = req.query;
  const employee = await getEmployeeByID(id);
  res.json(employee);
};

module.exports.getEmployeesByQueryFromDB = async (req, res) => {
  const { query, id_company } = req.query;
  const listEmployees = await employeesService.getAllMatchesEmployees(
    query,
    id_company
  );
  res.json(listEmployees);
};

module.exports.updateEmployee = async (req, res) => {
  const updated = await employeesService.updateEmployee(req.body);
  res.json(updated);
};

module.exports.deleteEmployee = async (req, res) => {
  const deleted = await employeesService.deleteEmployeeById(req.query);
  res.json(deleted);
};

// ************************ user for company

module.exports.getAllUsersCompany = async (req, res) => {
  const { id_company, offset } = req.query;
  const usersList = await employeesService.getAllUsersForCompany(
    id_company,
    offset
  );
  res.json(usersList);
};

module.exports.createUserCompany = async (req, res) => {
  const userCreated = await employeesService.createNewUserForCompany(req.body);
  res.json(userCreated);
};

module.exports.deleteUserCompany = async (req, res) => {
  const { id } = req.query;
  const userDeleted = await employeesService.deleteUserForCompany(id);
  res.json(userDeleted);
};
