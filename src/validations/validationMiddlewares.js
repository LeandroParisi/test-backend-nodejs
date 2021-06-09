const rescue = require('express-rescue');
const validate = require('./utils/validations');
const { throwError } = require('../errorHandler/errorHandler');
const {status, errorMessages} = require('../errorHandler/utils/status');

const validateRegisterProduct = rescue((req, _res, next) => {
  const {name, quantity, description, price, category} = req.body;

  const minLength = 5;
  const minValue = 0;

  if(!validate.nameValidation(name, minLength)) {
    throw new throwError(status.unprocessableEntity, errorMessages.smallName);
  };

  if(!validate.quantityTypeValidation(quantity)) {
    throw new throwError(status.unprocessableEntity, errorMessages.quantityAsNumber);
  }

  if(!validate.quantityValidation(quantity, minValue)) {
    throw new throwError(status.unprocessableEntity, errorMessages.lowQuantity);
  }

  if (!description) {
    throw new throwError(status.unprocessableEntity, errorMessages.missingDescription);
  }

  if (!price) {
    throw new throwError(status.unprocessableEntity, errorMessages.missingPrice);
  }

  if (!category) {
    throw new throwError(status.unprocessableEntity, errorMessages.missingCategory);
  }

  next();
});

module.exports = {
  validateRegisterProduct,
};
