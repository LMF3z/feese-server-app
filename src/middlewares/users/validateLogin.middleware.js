const validateFormats = require('../../services/validations/valdiateFormats.service');
const formSesionSchema = require('../../validations/forms.sesions.schema');

const validateFormatLogin = async (req, res, next) => {
  try {
    const isValid = await validateFormats.validateFormat(
      req.body,
      formSesionSchema.FormLoginSchema
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

const middlaware = { validateFormatLogin };

module.exports = middlaware;
