const models = require('../models/ProductsModel');
const { throwError } = require('../errorHandler/errorHandler');
const {status, errorMessages} = require('../errorHandler/utils/status');

const registerProduct = async ({name, quantity, description, price, category}) => {

  const product = await models.findByName(name);

  if (product) {
    throw new throwError(status.unprocessableEntity, errorMessages.productExists);
  }

  const insertedObject = await models
    .registerProduct(name, quantity, description, price, category);

  const responsePayload = {
    _id: insertedObject.insertedId,
    name,
    quantity,
    description,
    price,
    category,
  };

  return responsePayload;
};

const getByCategory = async ({category}) => {
  const products = await models.getByCategory(category);
  const responsePayload = {
    products
  };
  return responsePayload;
};

const getByName = async ({name}) => {
  const products = await models.getByName(name);
  const responsePayload = {
    products
  };
  return responsePayload;
};

const getAll = async () => {
  const products = await models.getAll();

  const responsePayload = {
    products
  };

  return responsePayload;
};

const findById = async (id) => {
  const product = await models.findById(id);

  return product;
};

const updateProduct = async ({name, quantity, description, price, category}) => {
  await models.updateProduct(name, quantity, description, price, category);

  const updatedProduct = {
    _id: id,
    name,
    quantity,
    description,
    price,
    category,
  };

  return updatedProduct;
};

const deleteProduct = async (id) => {
  const responsePayload = await models.deleteProduct(id);

  return responsePayload;
};

module.exports = {
  registerProduct,
  getAll,
  findById,
  updateProduct,
  deleteProduct,
  getByCategory,
  getByName
};
