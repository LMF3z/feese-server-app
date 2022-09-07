const express = require('express');
const router = express.Router();
const authRouter = require('./auth/auth.routes');
const companiesRouter = require('./companies/companies.routes');
const employeesRouter = require('./employees/employees.routes');
const expendituresRouter = require('./expenditures/expenditures.routes');
const servicesRouter = require('./services/services.routes');
const clientsRouter = require('./clients/clients.routes');
const ordersRouter = require('./orders/orders.routes');

router.get('/', (_req, res) => {
  res.json({ message: 'Hello world from API' });
});
router.use('/auth', authRouter);
router.use('/companies', companiesRouter);
router.use('/employees', employeesRouter);
router.use('/expenditures', expendituresRouter);
router.use('/services', servicesRouter);
router.use('/clients', clientsRouter);
router.use('/orders', ordersRouter);

module.exports = router;
