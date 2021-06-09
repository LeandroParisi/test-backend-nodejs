const nameValidation = (name, minLength) => {
  return typeof name === 'string' && name.length > minLength; 
};

const quantityValidation = (quantity, minValue) => {
  return  quantity > minValue;
};

const quantityTypeValidation = (quantity) => {
  return typeof quantity === 'number';
};

module.exports = {
  nameValidation,
  quantityValidation,
  quantityTypeValidation,
};