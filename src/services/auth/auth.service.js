const handlePasswords = require('../../validations/handlePasswords');

const {
  validateIsMembershipActive,
} = require('../companies/companiesMembership.service');

const loginUserForCompany = async (pass, dataUser) => {
  try {
    const isValidPassword = handlePasswords.comparePassword(
      pass,
      dataUser.password_user_company
    );

    if (!isValidPassword) {
      return {
        success: false,
        msg: 'Error en correo o contraseña',
        data: [],
      };
    }

    const token = handlePasswords.signToken(dataUser);

    const isActive = await validateIsMembershipActive(dataUser.id_company);

    return {
      success: true,
      msg: 'Inicio éxitoso.',
      data: {
        id_user: dataUser.id,
        id_company: dataUser.id_company,
        email_user_company: dataUser.email_user_company,
        isCompany: false,
        role: dataUser.role_user_company,
        token,
        isMembershipActive: isActive.data,
      },
    };
  } catch (error) {
    return {
      success: false,
      msg: 'Error al iniciar sesión.',
      data: [],
    };
  }
};

module.exports.loginUserForCompany = loginUserForCompany;
