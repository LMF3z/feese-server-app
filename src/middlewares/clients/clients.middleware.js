const validateFormats = require('../../services/validations/valdiateFormats.service');
const { FormClientSchema } = require('../../validations/form.clients');

const validateNewClientMiddlaware = async (req, res, next) => {
  try {
    const isValid = await validateFormats.validateFormat(
      req.body,
      FormClientSchema
    );

    if (!isValid) {
      return res.status(406).json({
        success: false,
        msg: 'Formato de datos no es valido.',
        data: [],
      });
    }

    next();
  } catch (error) {
    return {
      success: false,
      msg: 'Formato de datos no es valido.',
      data: [],
    };
  }
};

module.exports = validateNewClientMiddlaware;
