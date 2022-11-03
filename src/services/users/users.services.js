const {
  loginUserForCompany,
  loginForProductsServices,
} = require('../auth/auth.service');
const companyService = require('../companies/companies.service');
const { getUserForCompanyByEmail } = require('../employees/employees.service');

const loginUser = async (data) => {
  try {
    // * buscamos si es empresa
    const dataCompany = await companyService.getCompanyByEmail(data.email);

    if (dataCompany.data?.email_company) {
      const companyLogin = await companyService.loginCompany(
        data.password,
        dataCompany.data
      );

      return companyLogin;
    }

    // * buscamos si existe el usuarios en la tabla para usuarios de una empresa
    const dataUserForCompany = await getUserForCompanyByEmail(data.email);

    if (dataUserForCompany?.data?.email_user_company) {
      const userFormCompanyLogin = await loginUserForCompany(
        data.password,
        dataUserForCompany.data
      );

      return userFormCompanyLogin;
    }

    return {
      success: false,
      msg: 'Usuario o contraseña no validos.',
      data: [],
    };
  } catch (error) {
    console.log('Error al iniciar sesión *****************', error);

    return {
      success: false,
      msg: 'Error al iniciar sesión',
      data: [],
    };
  }
};

const services = { loginUser };

module.exports = services;
