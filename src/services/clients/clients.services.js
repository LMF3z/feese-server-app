const { Op } = require('sequelize');
const ModelClient = require('../../models/clients/clients.model');

const saveClient = async (data) => {
  try {
    const newClient = new ModelClient(data);
    const savedClient = await newClient.save();

    return {
      msg: 'Cliente guardado exitosamente',
      success: true,
      data: savedClient,
    };
  } catch (error) {
    return {
      msg: 'Error al guardar cliente',
      success: false,
      data: [],
    };
  }
};

const getAllMatches = async (query, id_company) => {
  let matchesClients = [];

  try {
    if (!isNaN(query)) {
      matchesClients = await ModelClient.findAll({
        where: {
          id_company,
          identification_client: {
            [Op.like]: `%${query}%`,
          },
        },
      });
    } else {
      matchesClients = await ModelClient.findAll({
        where: {
          id_company,
          name_client: {
            [Op.like]: `%${query}%`,
          },
        },
      });

      if (matchesClients.length === 0) {
        matchesClients = await ModelClient.findAll({
          where: {
            id_company,
            last_name_client: {
              [Op.like]: `%${query}%`,
            },
          },
        });
      }
    }

    return {
      msg: 'Lista de clientes',
      success: true,
      data: matchesClients,
    };
  } catch (error) {
    return {
      msg: 'Error al buscar clientes',
      success: false,
      data: [],
    };
  }
};

const getClientByID = async (idClient) => {
  try {
    const client = await ModelClient.findOne({
      where: {
        id: idClient,
      },
    });

    return {
      msg: 'Datos del cliente',
      success: true,
      data: client,
    };
  } catch (error) {
    return {
      msg: 'Error al buscar cliente',
      success: false,
      data: [],
    };
  }
};

module.exports.saveClient = saveClient;
module.exports.getClientByID = getClientByID;
module.exports.getAllMatches = getAllMatches;
