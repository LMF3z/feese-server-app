const handlePasswords = require('../../validations/handlePasswords');

const validateToken = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (authorization === undefined) {
      return res.json({
        success: false,
        msg: 'No tiene permisos para realizar esta acción',
        data: [],
        access: false,
      });
    }

    const getToken = authorization.split(' ')[1];

    const isValidToken = handlePasswords.verifyToken(getToken);

    if (!isValidToken.id) {
      return res.json({
        success: false,
        msg: 'No tiene permisos para realizar esta acción',
        data: [],
        access: false,
      });
    }

    next();
  } catch (error) {
    return res.json({
      success: false,
      msg: 'No tiene permisos para realizar esta acción',
      data: [],
      access: false,
    });
  }
};

const middleware = { validateToken };

module.exports = middleware;
