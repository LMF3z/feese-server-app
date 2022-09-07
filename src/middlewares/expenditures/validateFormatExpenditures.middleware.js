const validateFormats = require('../../services/validations/valdiateFormats.service');
const formExpenditure = require('../../validations/form.expenditures');

const validateRegisterExpenditure = async (req, res, next) => {
  try {
    const isValid = await validateFormats.validateFormat(
      req.body,
      formExpenditure.FormExpenditureSchema
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

const validate = { validateRegisterExpenditure };

module.exports = validate;
