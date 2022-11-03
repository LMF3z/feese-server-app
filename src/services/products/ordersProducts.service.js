const ModelOrdersProducts = require('../../models/products/ordersProducts.model');
const ModelProductsOrders = require('../../models/products/products_orders.model');
const { generateSequentialNumber } = require('../../utils/orders.utils');

const createNewOrderProducts = async (data) => {
  try {
    const newNumControl = await generateNewNumberControlOrdersProducts();

    data.num_control = newNumControl;

    const newOrderProducts = new ModelOrdersProducts(data);
    const newOrderProductsSaved = await newOrderProducts.save();

    return {
      success: true,
      msg: 'orden registrada exitosamente.',
      data: newOrderProductsSaved,
    };
  } catch (error) {
    console.log("'Error al guardar nueva orden'", error);
    return {
      success: false,
      msg: 'Error al guardar nueva orden',
      data: [],
    };
  }
};

const associateProductsToOrdersProducts = async (productsList, num_control) => {
  try {
    let results = [];

    for (const currentProduct of productsList) {
      currentProduct.num_control = num_control;
      const newProductOrder = new ModelProductsOrders(currentProduct);
      const saved = await newProductOrder.save();
      results.push(saved.dataValues);
    }

    return {
      success: true,
      msg: 'Productos asociados a la order exitosamente.',
      data: results,
    };
  } catch (error) {
    console.log("'Error al guardar nueva orden'", error);
    return {
      success: false,
      msg: 'Error al guardar nueva orden',
      data: [],
    };
  }
};

const getAmountOrdersProducts = async () => {
  try {
    const lastIdOrder = await ModelOrdersProducts.count();

    return lastIdOrder;
  } catch (error) {
    return {
      msg: 'Error al obtener numero de ordenes.',
      success: false,
      data: error,
    };
  }
};

const generateNewNumberControlOrdersProducts = async () => {
  const num_orders = await getAmountOrdersProducts();
  const seriesNum = generateSequentialNumber(num_orders + 1);
  const NewNumControl = `NOP-${seriesNum}`;
  return NewNumControl;
};

module.exports.createNewOrderProducts = createNewOrderProducts;
module.exports.associateProductsToOrdersProducts =
  associateProductsToOrdersProducts;
