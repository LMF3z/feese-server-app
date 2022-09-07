const validateFormats = require('../../services/validations/valdiateFormats.service');
const formRegisterCompany = require('../../validations/forms.sesions.schema');

const validateFormatRegisterCompany = async (req, res, next) => {
  try {
    const isValid = await validateFormats.validateFormat(
      req.body,
      formRegisterCompany.FormRegisterCompanySchema
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

const middlaware = { validateFormatRegisterCompany };

module.exports = middlaware;
