const usersServices = require('../../services/users/users.services');

const loginUser = async (req, res) => {
  const dataLogin = await usersServices.loginUser(req.body);
  res.json(dataLogin);
};

const controller = { loginUser };

module.exports = controller;
