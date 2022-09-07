const {
  saveExpenditureDB,
  getAllExpendituresPaginated,
  updateExpenditure,
  deleteExpenditure,
} = require('../../services/expenditures/expenditures.service');

const createNewExpenditure = async (req, res) => {
  const saved = await saveExpenditureDB(req.body);
  res.json(saved);
};

const getAllExpenditures = async (req, res) => {
  const { id_company, id_branches, offset, initialDate, finishDate } =
    req.query;

  const list = await getAllExpendituresPaginated({
    id_company,
    id_branches,
    offset: offset,
    initialDate,
    finishDate,
  });

  res.json(list);
};

const updateExpenditureByID = async (req, res) => {
  const updated = await updateExpenditure(req.body);
  res.json(updated);
};

const deleteExpenditureByID = async (req, res) => {
  const { id } = req.query;
  const updated = await deleteExpenditure(id);
  res.json(updated);
};

module.exports.createNewExpenditure = createNewExpenditure;
module.exports.getAllExpenditures = getAllExpenditures;
module.exports.updateExpenditureByID = updateExpenditureByID;
module.exports.deleteExpenditureByID = deleteExpenditureByID;
