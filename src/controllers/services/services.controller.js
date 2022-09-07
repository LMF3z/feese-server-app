const services = require('../../services/services/services.service');

const createService = async (req, res) => {
  const serviceCreated = await services.createNewService(req.body);
  res.json(serviceCreated);
};

const getServices = async (req, res) => {
  const { id_company, id_branches, offset, limit } = req.query;
  const list = await services.getServices({
    id_company,
    id_branches,
    offset: +offset,
  });

  res.json(list);
};

const getAllMatchesServicesController = async (req, res) => {
  const { query, id_company } = req.query;
  const servicesList = await services.getAllServicesMatches(query, id_company);
  res.json(servicesList);
};

const updateService = async (req, res) => {
  const updated = await services.updateService(req.body);
  res.json(updated);
};

const deleteEmployee = async (req, res) => {
  const deleted = await services.deleteServiceById(req.query);
  res.json(deleted);
};

const controller = {
  createService,
  getServices,
  getAllMatchesServicesController,
  updateService,
  deleteEmployee,
};

module.exports = controller;
