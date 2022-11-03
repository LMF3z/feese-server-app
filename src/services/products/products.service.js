const { Op } = require('sequelize');
const paginationConstants = require('../../constants/paginationConstants');
const ModelProducts = require('../../models/products/products.model');

const createNewProduct = async (newProductData) => {
  try {
    const newProduct = new ModelProducts(newProductData);
    const saved = await newProduct.save();

    return {
      msg: 'Producto creado exitosamente.',
      success: true,
      data: saved,
    };
  } catch (error) {
    return {
      msg: 'Error al crear nuevo producto.',
      success: false,
      data: error,
    };
  }
};

const getAllProducts = async (id_company, offset = 0) => {
  try {
    const productsList = await ModelProducts.findAll({
      where: {
        id_company,
        is_enable: true,
      },
      limit: paginationConstants.limit,
      offset: +offset,
    });

    return {
      msg: 'Lista de productos.',
      success: true,
      data: productsList,
    };
  } catch (error) {
    return {
      msg: 'Error al obtener productos',
      success: false,
      data: [],
    };
  }
};

const getProductById = async (id_company, id_product) => {
  try {
    const product = await ModelProducts.findOne({
      where: {
        id_company,
        id: id_product,
        is_enable: true,
      },
    });

    return {
      msg: 'Producto.',
      success: true,
      data: product,
    };
  } catch (error) {
    return {
      msg: 'Error al obtener producto.',
      success: false,
      data: [],
    };
  }
};

const getProductByQuery = async (id_company, query) => {
  try {
    matchesProducts = await ModelProducts.findAll({
      where: {
        id_company,
        is_enable: true,
        title: {
          [Op.like]: `%${query}%`,
        },
      },
    });

    return {
      msg: 'Lista de productos.',
      success: true,
      data: matchesProducts,
    };
  } catch (error) {
    console.log("'Error al obtener productos por title.'", error);
    return {
      msg: 'Error al obtener productos por title.',
      success: false,
      data: [],
    };
  }
};

const updateProduct = async (id_product, data) => {
  try {
    const updated = await ModelProducts.update(data, {
      where: {
        id: id_product,
      },
    });

    return {
      msg: 'Producto actualizado exitosamente.',
      success: true,
      data: updated,
    };
  } catch (error) {
    console.log('error al actualizar producto', error);
    return {
      msg: 'Error al actualizar producto',
      success: false,
      data: [],
    };
  }
};

const deleteProduct = async (id_product) => {
  try {
    const deleted = await ModelProducts.update(
      { is_enable: false },
      {
        where: {
          id: id_product,
        },
      }
    );

    return {
      msg: 'Producto eliminado exitosamente.',
      success: true,
      data: deleted,
    };
  } catch (error) {
    console.log('error al eliminar producto', error);
    return {
      msg: 'Error al eliminar producto',
      success: false,
      data: [],
    };
  }
};

module.exports.createNewProduct = createNewProduct;
module.exports.getAllProducts = getAllProducts;
module.exports.getProductById = getProductById;
module.exports.getProductByQuery = getProductByQuery;
module.exports.updateProduct = updateProduct;
module.exports.deleteProduct = deleteProduct;
