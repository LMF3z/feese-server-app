const { Op } = require('sequelize');
const ModelEmployee = require('../../models/employees/employee.model');
const ModelOrderEmployees = require('../../models/orders/orderEmployees.model');
const ModelUsersForCompany = require('../../models/employees/usersForCompany.model');
const handlePasswords = require('../../validations/handlePasswords');
const paginationConstants = require('../../constants/paginationConstants');

const getAmountUsersForCompany = async (id) => {
  try {
    const usersAmount = await ModelUsersForCompany.count({
      where: {
        id_company: id,
      },
    });

    return usersAmount;
  } catch (error) {
    return {
      msg: 'Error al obtener numero de ordenes.',
      success: false,
      data: error,
    };
  }
};

const createNewEmployee = async (data) => {
  try {
    const newEployee = new ModelEmployee(data);

    const saved = await newEployee.save();

    return {
      success: true,
      msg: 'Empleado registrado exitosamente.',
      data: saved,
    };
  } catch (error) {
    return {
      success: false,
      msg: error,
      data: [],
    };
  }
};

const getEmployees = async (data) => {
  const { id_company, id_branches, offset } = data;

  let employeesList = {};

  try {
    if (+id_company >= 1 && !isNaN(+id_branches) >= 1) {
      employeesList = await ModelEmployee.findAndCountAll({
        where: {
          isActive: true,
          id_company: +id_company,
          id_branches: +id_branches,
        },
        offset: +offset,
        limit: paginationConstants.limit,
      });
    }

    if (+id_company >= 1 && (isNaN(+id_branches) || id_branches === null)) {
      employeesList = await ModelEmployee.findAndCountAll({
        where: {
          isActive: true,
          id_company: +id_company,
          [Op.or]: {
            id_branches: null,
          },
        },
        offset: +offset,
        limit: paginationConstants.limit,
      });
    }

    return {
      success: true,
      msg: 'Lista de empleados.',
      data: employeesList,
    };
  } catch (error) {
    return {
      success: false,
      msg: 'Error al obtener empleados ',
      data: [],
    };
  }
};

const getAllMatchesEmployees = async (query, id_company) => {
  let matchesEmployees = [];

  try {
    if (!isNaN(query)) {
      matchesEmployees = await ModelEmployee.findAll({
        where: {
          id_company,
          identification_employee: {
            [Op.like]: `%${query}%`,
          },
        },
      });
    } else {
      matchesEmployees = await ModelEmployee.findAll({
        where: {
          id_company,
          name_employee: {
            [Op.like]: `%${query}%`,
          },
        },
      });

      if (matchesEmployees.length === 0) {
        matchesEmployees = await ModelEmployee.findAll({
          where: {
            id_company,
            last_name_employee: {
              [Op.like]: `%${query}%`,
            },
          },
        });
      }
    }

    return {
      msg: 'Lista de empleados',
      success: true,
      data: matchesEmployees,
    };
  } catch (error) {
    return {
      msg: 'Error al buscar empleados',
      success: false,
      data: [],
    };
  }
};

const updateEmployee = async (data) => {
  try {
    const updatedEmployee = await ModelEmployee.update(data, {
      where: { id: +data.id },
    });

    return {
      success: true,
      msg: 'Empleado actualizado exitosamente.',
      data: updatedEmployee,
    };
  } catch (error) {
    return {
      success: false,
      msg: 'Error al actualizar empleados ',
      data: [],
    };
  }
};

const deleteEmployeeById = async (query) => {
  const { id_employee, id_company, id_branches } = query;

  try {
    let deletedEmployee = {};

    if (+id_company >= 1 && !isNaN(+id_branches) >= 1) {
      deletedEmployee = await ModelEmployee.update(
        {
          isActive: false,
        },
        {
          where: { id: +id_employee, id_branches: +id_branches },
        }
      );
    }

    if (+id_company >= 1 && isNaN(+id_branches)) {
      deletedEmployee = await ModelEmployee.update(
        {
          isActive: false,
        },
        {
          where: {
            id: +id_employee,
            id_company: +id_company,
            [Op.or]: {
              id_branches: null,
            },
          },
        }
      );
    }

    return {
      success: true,
      msg: 'Lista de empleados.',
      data: deletedEmployee,
    };
  } catch (error) {
    return {
      success: false,
      msg: 'Error al obtener empleados ',
      data: [],
    };
  }
};

// associate to orders
const associateEmployeeToOrder = async (employees, num_control, createdAt) => {
  try {
    const employeesAssociated = [];

    for (const employee of employees) {
      const dataNewAssociateEmployee = {
        id_company: employee.id_company,
        id_branches: employee.id_branches,
        id_employee: employee.id,
        num_control,
        createdAt,
      };

      const newAssociateEmployee = new ModelOrderEmployees(
        dataNewAssociateEmployee
      );
      const saved = await newAssociateEmployee.save();
      employeesAssociated.push(saved.dataValues);
    }

    return {
      msg: 'Empleados asociados a la orden exitosamente.',
      success: true,
      data: employeesAssociated,
    };
  } catch (error) {
    return {
      msg: 'Error al asociar empleado a la orden.',
      success: false,
      data: null,
    };
  }
};

const getEmployeeByID = async (id_employee) => {
  try {
    const employee = await ModelEmployee.findOne({
      where: {
        isActive: true,
        id: id_employee,
      },
    });

    return {
      success: employee,
      msg: 'Empledo.',
      data: employee,
    };
  } catch (error) {
    return {
      success: false,
      msg: 'Error al obtener empleado ',
      data: [],
    };
  }
};
module.exports.getEmployeeByID = getEmployeeByID;

// * user for company
const getAllUsersForCompany = async (id_company, offset) => {
  try {
    const usersList = await ModelUsersForCompany.findAll({
      where: {
        id_company,
      },
      attributes: [
        'id',
        'id_company',
        'alias_user_company',
        'email_user_company',
        'role_user_company',
      ],
      limit: paginationConstants.limit,
      offset: +offset,
    });

    return {
      msg: 'Lista de usuarios.',
      success: true,
      data: usersList,
    };
  } catch (error) {
    return {
      msg: 'Error al obtener usuarios',
      success: false,
      data: [],
    };
  }
};
module.exports.getAllUsersForCompany = getAllUsersForCompany;

const getUserForCompanyByEmail = async (email) => {
  try {
    const userData = await ModelUsersForCompany.findOne({
      where: {
        email_user_company: email,
      },
    });

    return {
      msg: 'Datos del usuario.',
      success: true,
      data: userData,
    };
  } catch (error) {
    return {
      msg: 'Error al obtener datos del usuario',
      success: false,
      data: [],
    };
  }
};
module.exports.getUserForCompanyByEmail = getUserForCompanyByEmail;

const createNewUserForCompany = async (data) => {
  try {
    const newPassword = await handlePasswords.encripPassword(
      data.password_user_company
    );
    data.password_user_company = newPassword;

    const newUserForCompany = new ModelUsersForCompany(data);
    const saved = await newUserForCompany.save();

    return {
      msg: 'Usuario creado exitosamente.',
      success: true,
      data: saved,
    };
  } catch (error) {
    return {
      msg: 'Error al crear usuario',
      success: false,
      data: [],
    };
  }
};
module.exports.createNewUserForCompany = createNewUserForCompany;

const deleteUserForCompany = async (id) => {
  try {
    const deleted = await ModelUsersForCompany.destroy({
      where: {
        id,
      },
    });

    return {
      msg: 'Usuario eliminado exitosamente.',
      success: true,
      data: deleted,
    };
  } catch (error) {
    return {
      msg: 'Error al eliminar usuario',
      success: false,
      data: [],
    };
  }
};
module.exports.deleteUserForCompany = deleteUserForCompany;

const services = {
  createNewEmployee,
  getEmployees,
  getAllMatchesEmployees,
  updateEmployee,
  deleteEmployeeById,
  getEmployeeByID,

  // ---------------------
  getAllUsersForCompany,
  getUserForCompanyByEmail,
  getAmountUsersForCompany,
  createNewUserForCompany,
  deleteUserForCompany,
  // ---------------------
  associateEmployeeToOrder,
};

module.exports = services;
