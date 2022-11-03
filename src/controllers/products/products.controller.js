const {
  createNewProduct,
  getAllProducts,
  getProductById,
  getProductByQuery,
  updateProduct,
  deleteProduct,
} = require('../../services/products/products.service');

const createNewProductController = async (req, res) => {
  const saved = await createNewProduct(req.body);
  res.json(saved);
};

const getAllProductsController = async (req, res) => {
  const { id_company, offset } = req.query;
  const productsList = await getAllProducts(id_company, offset);
  res.json(productsList);
};

const getProductByIdController = async (req, res) => {
  const { id_company, id_product } = req.query;
  const product = await getProductById(id_company, id_product);
  res.json(product);
};

const getProductByQueryController = async (req, res) => {
  const { id_company, title } = req.query;
  const productsList = await getProductByQuery(id_company, title);
  res.json(productsList);
};

const updateProductController = async (req, res) => {
  const updated = await updateProduct(req.body.id_product, req.body);
  res.json(updated);
};

const deleteProductController = async (req, res) => {
  const { id_product } = req.query;
  console.log('id_product ------------------>', id_product);
  const deleted = await deleteProduct(id_product);
  res.json(deleted);
};

module.exports.createNewProductController = createNewProductController;
module.exports.getAllProductsController = getAllProductsController;
module.exports.getProductByIdController = getProductByIdController;
module.exports.getProductByQueryController = getProductByQueryController;
module.exports.updateProductController = updateProductController;
module.exports.deleteProductController = deleteProductController;
