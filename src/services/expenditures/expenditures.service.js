const { Op } = require('sequelize');
const { connectionDB } = require('../../config/mysql');
const sequelize = connectionDB.sequelize;
const paginationConstants = require('../../constants/paginationConstants');
const ModelExpenditure = require('../../models/expenditures/expenditures.model');
const {
  generateSequentialNumber,
  getHourOfDate,
} = require('../../utils/orders.utils');
const ordersServices = require('../orders/orders.service');

const getAmountExpenditures = async (id) => {
  try {
    const lastIdExpenditure = await ModelExpenditure.findAll({
      where: {
        id_company: id,
      },
      attributes: ['id'],
      order: [['id', 'DESC']],
    });

    return lastIdExpenditure[0]?.dataValues
      ? lastIdExpenditure[0].dataValues.id
      : 0;
  } catch (error) {
    return {
      msg: 'Error al obtener numero de gastos.',
      success: false,
      data: error,
    };
  }
};

const generateNewNumberControl = async (id_company) => {
  const num_expenditures = await getAmountExpenditures(id_company);

  const seriesNum = generateSequentialNumber(num_expenditures + 1);
  const NewNumControl = `NG-${seriesNum}`;
  return NewNumControl;
};

module.exports.getTotalExpenditureByRangeDate = async ({
  id_company,
  initialDate,
  finishDate,
}) => {
  try {
    const total = await ModelExpenditure.findAll({
      where: {
        id_company,
        createdAt: {
          [Op.between]: [initialDate, finishDate],
        },
      },
      attributes: [
        [sequelize.fn('sum', sequelize.col('cost_expenditure')), 'total'],
      ],
    });

    const totalExpend = total[0].dataValues.total;

    return {
      msg: 'Total de gastos',
      success: true,
      data: totalExpend > 0 ? totalExpend.toFixed(2) : 0,
    };
  } catch (error) {
    return {
      msg: 'Error al buscar total de gastos',
      success: false,
      data: [],
    };
  }
};

const saveExpenditureDB = async (data) => {
  try {
    const totalCashEnable = await ordersServices.getTotalEnableCash({
      id_company: +data.id_company,
      actualDate: data.createdAt,
    });

    if (totalCashEnable < data.cost_expenditure) {
      return {
        success: false,
        msg: 'No hay efectivo suficiente',
        data: [],
      };
    }

    const newNumControl = await generateNewNumberControl(data.id_company);
    data.num_control = newNumControl;
    data.hour = getHourOfDate(data.createdAt);

    const newExpenditure = new ModelExpenditure(data);
    const expenditureSaved = await newExpenditure.save();

    return {
      msg: 'Gasto guardado exitosamente.',
      success: true,
      data: expenditureSaved,
    };
  } catch (error) {
    return {
      msg: 'Error al guardar gasto.',
      success: false,
      data: null,
    };
  }
};

const getAllExpendituresPaginated = async (data) => {
  const { id_company, id_branches, offset, initialDate, finishDate } = data;

  let expendituresList = {};

  try {
    if (+id_company >= 1 && !isNaN(+id_branches) >= 1) {
      expendituresList = await ModelExpenditure.findAndCountAll({
        where: {
          id_company: +id_company,
          id_branches: +id_branches,
          createdAt: {
            [Op.between]: [initialDate, finishDate],
          },
        },
        offset: +offset,
        limit: paginationConstants.limit,
      });
    }

    if (+id_company >= 1 && isNaN(+id_branches)) {
      expendituresList = await ModelExpenditure.findAndCountAll({
        where: {
          id_company: +id_company,
          [Op.or]: {
            id_branches: null,
          },
          createdAt: {
            [Op.between]: [initialDate, finishDate],
          },
        },
        offset: +offset,
        limit: paginationConstants.limit,
      });
    }

    return {
      success: true,
      msg: 'Lista de gastos.',
      data: expendituresList,
    };
  } catch (error) {
    return {
      success: false,
      msg: 'Error al obtener gastos ',
      data: [],
    };
  }
};

const updateExpenditure = async (data) => {
  try {
    const expenditureUpdated = await ModelExpenditure.update(data, {
      where: {
        id: data.id,
      },
    });

    return {
      msg: 'Gasto actualizado exitosamente.',
      success: true,
      data: expenditureUpdated,
    };
  } catch (error) {
    return {
      msg: 'Error al actualizar gasto.',
      success: false,
      data: error,
    };
  }
};

const deleteExpenditure = async (id_expenditure) => {
  try {
    const expenditureDeleted = await ModelExpenditure.destroy({
      where: {
        id: id_expenditure,
      },
    });

    return {
      msg: 'Gasto eliminado exitosamente.',
      success: true,
      data: expenditureDeleted,
    };
  } catch (error) {
    return {
      msg: 'Error al eliminar gasto.',
      success: false,
      data: error,
    };
  }
};

module.exports.saveExpenditureDB = saveExpenditureDB;
module.exports.getAllExpendituresPaginated = getAllExpendituresPaginated;
module.exports.updateExpenditure = updateExpenditure;
module.exports.deleteExpenditure = deleteExpenditure;
