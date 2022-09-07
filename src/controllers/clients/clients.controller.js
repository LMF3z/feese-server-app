const {
  saveClient,
  getClientByID,
  getAllMatches,
} = require('../../services/clients/clients.services');

const createClient = async (req, res) => {
  const savedClient = await saveClient(req.body);
  res.json(savedClient);
};

const getClientByIDController = async (req, res) => {
  const { idClient } = req.query;
  const clientList = await getClientByID(idClient);
  res.json(clientList);
};

const getAllMatchesClientController = async (req, res) => {
  const { query, id_company } = req.query;
  const clientList = await getAllMatches(query, id_company);
  res.json(clientList);
};

module.exports.createClient = createClient;
module.exports.getClientByIDController = getClientByIDController;
module.exports.getAllMatchesClientController = getAllMatchesClientController;
