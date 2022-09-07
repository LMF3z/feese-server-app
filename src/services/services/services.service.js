const { Op } = require('sequelize');
const ModelServices = require('../../models/services/services.model');
const ModelOrderServices = require('../../models/orders/orderServices.model');
const handleErrors = require('../../validations/handleErrors');
const paginationConstants = require('../../constants/paginationConstants');

const createNewService = async (data) => {
  try {
    const newService = new ModelServices(data);

    const saved = await newService.save();

    return {
      success: true,
      msg: 'Servicio registrado exitosamente.',
      data: saved,
    };
  } catch (error) {
    const data_error = handleErrors.handleErrorDb(error);
    return {
      success: false,
      msg: 'Error al registrar servicio ',
      data: [],
    };
  }
};

const getServices = async (data) => {
  const { id_company, id_branches, offset } = data;

  let servicesList = {};

  try {
    if (+id_company >= 1 && !isNaN(+id_branches) >= 1) {
      servicesList = await ModelServices.findAndCountAll({
        where: {
          isActive: true,
          id_company: +id_company,
          id_branches: +id_branches,
        },
        offset: +offset,
        limit: paginationConstants.limit,
      });
    }

    if (+id_company >= 1 && isNaN(+id_branches)) {
      servicesList = await ModelServices.findAndCountAll({
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
      data: servicesList,
    };
  } catch (error) {
    return {
      success: false,
      msg: 'Error al obtener empleados ',
      data: [],
    };
  }
};

const getServiceByID = async (id_service) => {
  try {
    const service = await ModelServices.findOne({
      where: {
        id: id_service,
      },
    });

    return {
      msg: 'Servicio',
      success: true,
      data: service,
    };
  } catch (error) {
    return {
      msg: 'Error al buscar servicio por id.',
      success: false,
      data: [],
    };
  }
};

const getAllServicesMatches = async (query, id_company) => {
  try {
    const matchesServices = await ModelServices.findAll({
      where: {
        id_company,
        name_service: {
          [Op.like]: `%${query}%`,
        },
      },
    });

    return {
      msg: 'Lista de servicios',
      success: true,
      data: matchesServices,
    };
  } catch (error) {
    return {
      msg: 'Error al buscar servicios',
      success: false,
      data: [],
    };
  }
};

const getAllServicesAssociatedToOrder = async (num_control) => {
  const results = [];

  try {
    const matchesOrdersServices = await ModelOrderServices.findAll({
      where: {
        num_control,
      },
    });

    for (const service of matchesOrdersServices) {
      const serviceSelected = await getServiceByID(service.id_service);
      results.push(serviceSelected.data);
    }

    return {
      msg: 'Lista de servicios',
      success: true,
      data: results,
    };
  } catch (error) {
    return {
      msg: 'Error al buscar servicios asociados a la orden.',
      success: false,
      data: [],
    };
  }
};

const updateService = async (data) => {
  try {
    const updatedService = await ModelServices.update(data, {
      where: { id: +data.id },
    });

    return {
      success: true,
      msg: 'Servicio actualizado exitosamente.',
      data: updatedService,
    };
  } catch (error) {
    return {
      success: false,
      msg: 'Error al actualizar servicio ',
      data: [],
    };
  }
};

const deleteServiceById = async (query) => {
  const { id_service, id_company, id_branches } = query;

  try {
    let deletedService = {};

    if (+id_company >= 1 && !isNaN(+id_branches) >= 1) {
      deletedService = await ModelServices.update(
        {
          isActive: false,
        },
        {
          where: { id: +id_service, id_branches: +id_branches },
        }
      );
    }

    if (+id_company >= 1 && isNaN(+id_branches)) {
      deletedService = await ModelServices.update(
        {
          isActive: false,
        },
        {
          where: {
            id: +id_service,
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
      msg: 'Servicio eliminado exitosamente.',
      data: deletedService,
    };
  } catch (error) {
    return {
      success: false,
      msg: 'Error al obtener servicios ',
      data: [],
    };
  }
};

// associate to orders
const associateServicesToOrder = async (services, num_control, createdAt) => {
  try {
    const servicesAssociated = [];

    for (const service of services) {
      const dataNewAssociateService = {
        id_company: service.id_company,
        id_branches: service.id_branches,
        id_service: service.id,
        num_control,
        createdAt,
      };

      const newAssociateService = new ModelOrderServices(
        dataNewAssociateService
      );
      const saved = await newAssociateService.save();
      servicesAssociated.push(saved.dataValues);
    }

    return {
      msg: 'Servicios asociados a la orden exitosamente.',
      success: true,
      data: servicesAssociated,
    };
  } catch (error) {
    return {
      msg: 'Error al asociar servicios a la orden.',
      success: false,
      data: null,
    };
  }
};

const services = {
  createNewService,
  getServices,
  getAllServicesMatches,
  getAllServicesAssociatedToOrder,
  updateService,
  deleteServiceById,
  // -----------------
  associateServicesToOrder,
};

module.exports = services;
