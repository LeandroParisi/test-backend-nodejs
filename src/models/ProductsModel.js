const connection = require('./connection');
const { ObjectId } = require('mongodb');
const dbCollection = 'products';
const { throwError } = require('../errorHandler/errorHandler');
const {status, errorMessages} = require('../errorHandler/utils/status');

const registerProduct = async (name, quantity, description, price, category) => {
  const insertedObject = await connection().then((db) => 
    db
      .collection(dbCollection)
      .insertOne({name, quantity, description, price, category})
  );

  return insertedObject;
};

const getByCategory = async (category) => {
  const products = await connection().then((db) =>
    db
      .collection(dbCollection)
      .find({category})  
  );

  return products;
};

const getByName = async (name) => {
  const product = await connection().then((db) => 
    db
      .collection(dbCollection)
      .findOne({name})
  );

  return product;
};

const getAll = async () => {
  const products = await connection().then((db) =>
    db
      .collection(dbCollection)
      .find()
      .toArray()
  );

  return products;
};

const getById = async (id) => {
  const product = await connection().then((db) =>
    db
      .collection(dbCollection)
      .findOne({_id: ObjectId(id)})
  ).catch(err => {
    throw new throwError(status.unprocessableEntity, errorMessages.wrongId);
  });

  return product;
};

const updateProduct = async (name, quantity, description, price, category, id) => {
  const updatedProduct = await connection().then((db) => {
    db
      .collection(dbCollection)
      .updateOne(
        {_id: ObjectId(id)},
        {$set: {name, quantity, description, price, category}}
      );
  });
  return updatedProduct;

};

const deleteProduct = async (id) => {
  const responsePayload = await connection().then((db) => {
    db
      .collection(dbCollection)
      .deleteOne({_id: ObjectId(id)});
  }).catch(err => {
    throw new throwError(status.unprocessableEntity, errorMessages.wrongId);
  });;
  return responsePayload;

};

module.exports = {
  registerProduct,
  getByCategory,
  getByName,
  getAll,
  getById,
  updateProduct,
  deleteProduct,
};