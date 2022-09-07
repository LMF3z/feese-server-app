const { usersForCompany } = require('../../constants/globalsConstants');
const {
  getAmountUsersForCompany,
} = require('../../services/employees/employees.service');
const validateFormats = require('../../services/validations/valdiateFormats.service');
const formEmployee = require('../../validations/form.employee');

const validateRegisterEmployee = async (req, res, next) => {
  try {
    const isValid = await validateFormats.validateFormat(
      req.body,
      formEmployee.FormEmployeeSchema
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

const validateFormatNewUserForCompany = async (req, res, next) => {
  try {
    const isValid = await validateFormats.validateFormat(
      req.body,
      formEmployee.FormUsersCompany
    );

    if (!isValid) {
      return res.status(406).json({
        success: false,
        msg: 'Formato de datos no es valido.',
        data: [],
      });
    }

    const validateAmountUsersForCompany = await getAmountUsersForCompany(
      req.body.id_company
    );

    if (validateAmountUsersForCompany === usersForCompany.limitAmount) {
      return res.status(200).json({
        success: false,
        msg: 'Haz alcanzado el limite de usuarios registrados. Elimine algunos para poder crear nuevos.',
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

const validate = { validateRegisterEmployee, validateFormatNewUserForCompany };

module.exports = validate;
