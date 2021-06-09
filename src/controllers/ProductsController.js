const ProductsServices = require('../services/ProductsServices');
const rescue = require('express-rescue');
const {status, errorMessages} = require('../errorHandler/utils/status');
const { throwError } = require('../errorHandler/errorHandler');


const registerProduct = rescue(async (req, res) => {
  const { body } = req;
  const responsePayload = await ProductsServices.registerProduct(body);

  res.status(status.created).json(responsePayload);
});

const getByCategory = async (req, res) => {
  const { body } = req;
  const responsePayload = await ProductsServices.getByCategory(body);
  res.status(status.ok).json(responsePayload);
};

const getByName = async (req, res) => {
  const { body } = req;
  const responsePayload = await ProductsServices.getByName(body);
  res.status(status.ok).json(responsePayload);
};

const getAll = async (req, res) => {
  const responsePayload = await ProductsServices.getAll();
  res.status(status.ok).json(responsePayload);
};

const getById = rescue(async (req, res) => {
  const {id} = req.params;

  const responsePayload = await ProductsServices.getById(id);

  res.status(status.ok).json(responsePayload);
});

const updateProducts = async (req, res) => {
  const { body } = req;
  const { id } = req.params;

  const responsePayload = await ProductsServices.updateProduct(body, id);

  res.status(status.ok).json(responsePayload);
};

const deleteProduct = rescue(async (req, res) => {
  const { id } = req.params;

  const hasProduct = await ProductsServices.getById(id);

  if(!hasProduct) throw new throwError(status.unprocessableEntity, errorMessages.wrongId);

  await ProductsServices.deleteProduct(id);

  const {name} = hasProduct;

  const responsePayload = {
    _id: id,
    message: 'Product deleted successfully',
    name,
  };

  res.status(status.ok).json(responsePayload);
});

module.exports = {
  registerProduct,
  getAll,
  getById,
  updateProducts,
  deleteProduct,
  getByCategory,
  getByName
};