const companiesService = require('../../services/companies/companies.service');

const registerCompanies = async (req, res) => {
  const companyData = await companiesService.saveNewCompany(req.body);
  res.json(companyData);
};

const login = async (req, res) => {};

const getCompanyByIDFromDb = async (req, res) => {
  const { id } = req.query;
  const companyData = await companiesService.getCompanyByID(id);
  res.json(companyData);
};

const updateDataCompaniesFromDB = async (req, res) => {
  const updated = await companiesService.updateDataCompanies(req.body);
  res.json(updated);
};

const controller = {
  registerCompanies,
  login,
  getCompanyByIDFromDb,
  updateDataCompaniesFromDB,
};

module.exports = controller;
