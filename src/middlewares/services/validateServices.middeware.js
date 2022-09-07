const validateFormats = require('../../services/validations/valdiateFormats.service');
const formServices = require('../../validations/form.services');

const validateRegisterServices = async (req, res, next) => {
  try {
    const isValid = await validateFormats.validateFormat(
      req.body,
      formServices.FormServicesSchema
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

const validate = { validateRegisterServices };

module.exports = validate;
