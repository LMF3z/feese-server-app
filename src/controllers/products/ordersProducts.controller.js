const {
  createNewOrderProducts,
  associateProductsToOrdersProducts,
} = require('../../services/products/ordersProducts.service');

const createNewOrderProductsController = async (req, res) => {
  const orderProductsSaved = await createNewOrderProducts(req.body);

  if (!orderProductsSaved.success) {
    return res.json(orderProductsSaved);
  }

  const productsAssociated = await associateProductsToOrdersProducts(
    req.body.products_selected,
    orderProductsSaved.data.dataValues.num_control
  );

  if (!productsAssociated.success) {
    // TODO: en este caso se debe anular la orden anterior
    return res.json(productsAssociated);
  }

  const response = {
    ...orderProductsSaved.data.dataValues,
    products_selected: [...productsAssociated.data],
  };

  res.json({
    success: true,
    msg: 'Orden generada exitosamente. Espere...',
    data: response,
  });
};

module.exports.createNewOrderProductsController =
  createNewOrderProductsController;
