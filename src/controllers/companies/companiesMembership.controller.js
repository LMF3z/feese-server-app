const {
  saveNewPaymentCompanyMembership,
  getLastDatePaymentMembership,
} = require('../../services/companies/companiesMembership.service');

const registerCompanyMembership = async (req, res) => {
  const saved = await saveNewPaymentCompanyMembership(req.body);
  res.json(saved);
};

const getLastDatePaymentMembershipController = async (req, res) => {
  const { id_company } = req.query;
  const date = await getLastDatePaymentMembership(id_company);
  res.json(date);
};

module.exports.registerCompanyMembership = registerCompanyMembership;
module.exports.getLastDatePaymentMembershipController =
  getLastDatePaymentMembershipController;
