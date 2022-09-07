const express = require('express');
const router = express.Router();
// middlewares
const validateFormatCompany = require('../../middlewares/companies/validateRegisterCompany.middleware');
const validateSesion = require('../../middlewares/users/validateLogin.middleware');
// controllers
const companiesController = require('../../controllers/companies/companies.controller');
const usersController = require('../../controllers/users/users.controller');
const validateToken = require('../../middlewares/security/validateToken');

router.post(
  '/register-company',
  validateFormatCompany.validateFormatRegisterCompany,
  companiesController.registerCompanies
);

router.post(
  '/login',
  validateSesion.validateFormatLogin,
  usersController.loginUser
);

router.post('/is-token-valid', validateToken.validateToken, (_req, res) =>
  res.json({
    success: true,
    access: true,
  })
);

module.exports = router;
