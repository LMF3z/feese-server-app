const ModelCompany = require('../../models/companies/companies.model');
const ModelCompanyMembership = require('../../models/companies-memberships/companiesMemberships.model');
const handlePasswords = require('../../validations/handlePasswords');
const handleErrors = require('../../validations/handleErrors');
const { validateIsMembershipActive } = require('./companiesMembership.service');

const saveNewCompany = async (data) => {
  try {
    const newPassword = handlePasswords.encripPassword(data.password_company);
    data.password_company = newPassword;

    const newEnterprise = new ModelCompany(data);

    const saved = await newEnterprise.save();

    return {
      success: true,
      msg: 'Registro exitoso.',
      data: saved,
    };
  } catch (error) {
    const data_error = handleErrors.handleErrorDb(error);
    return {
      success: false,
      msg: 'Error al guardar empresa/local ' + data_error,
      data: [],
    };
  }
};

const getCompanyByEmail = async (email) => {
  try {
    const existCompany = await ModelCompany.findOne({
      where: {
        email_company: email,
      },
    });

    return {
      success: true,
      msg: 'Company.',
      data: existCompany,
    };
  } catch (error) {
    return {
      success: false,
      msg: 'Error al encontrar empresa/local',
      data: [],
    };
  }
};

const getCompanyByID = async (id_company) => {
  try {
    const dataCompany = await ModelCompany.findOne({
      where: {
        id: id_company,
      },
    });

    const copyData = dataCompany.dataValues;
    delete copyData.password_company;

    return {
      success: true,
      msg: 'Company.',
      data: copyData,
    };
  } catch (error) {
    return {
      success: false,
      msg: 'Error al encontrar empresa/local',
      data: [],
    };
  }
};

const updateDataCompanies = async (data) => {
  try {
    const dataCompany = await ModelCompany.update(data, {
      where: {
        id: data.id,
      },
    });

    return {
      success: true,
      msg: 'Empresa actualizada exitosamente.',
      data: dataCompany,
    };
  } catch (error) {
    return {
      success: false,
      msg: 'Error al actualizar empresa/local',
      data: [],
    };
  }
};

const loginCompany = async (pass, dataCompany) => {
  try {
    const isValidPassword = handlePasswords.comparePassword(
      pass,
      dataCompany.password_company
    );

    if (!isValidPassword) {
      return {
        success: false,
        msg: 'Error en correo o contraseña',
        data: [],
      };
    }

    const token = handlePasswords.signToken(dataCompany);

    const isActive = await validateIsMembershipActive(dataCompany.id);

    return {
      success: true,
      msg: 'Inicio éxitoso.',
      data: {
        id_company: dataCompany.id,
        email_company: dataCompany.email_company,
        isCompany: dataCompany.isCompany,
        type_company: dataCompany.type_company,
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

const services = {
  saveNewCompany,
  getCompanyByEmail,
  getCompanyByID,
  updateDataCompanies,
  loginCompany,
};

module.exports = services;
