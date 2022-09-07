const express = require('express');
const {
  createNewExpenditure,
  getAllExpenditures,
  updateExpenditureByID,
  deleteExpenditureByID,
} = require('../../controllers/expenditures/expenditures.controller');
const {
  validateStateMembership,
} = require('../../middlewares/security/validateMembershipState.middleware');
const router = express.Router();
const validateToken = require('../../middlewares/security/validateToken');

router.post(
  '/create-expenditure',
  validateToken.validateToken,
  validateStateMembership,
  createNewExpenditure
);

router.get(
  '/get-all-expenditures',
  validateToken.validateToken,
  getAllExpenditures
);

router.put(
  '/update-expenditure',
  validateToken.validateToken,
  validateStateMembership,
  updateExpenditureByID
);

router.delete(
  '/delete-expenditure',
  validateToken.validateToken,
  validateStateMembership,
  deleteExpenditureByID
);

module.exports = router;
