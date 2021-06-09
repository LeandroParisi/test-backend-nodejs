const { Router } = require('express');
const ProductController = require('../controllers/ProductsController');
const { validateRegisterProduct } = require('../validations/validationMiddlewares');


const ProductsRouter = new Router();

ProductsRouter.post('/', validateRegisterProduct, ProductController.registerProduct);

ProductsRouter.get('/', ProductController.getAll);

ProductsRouter.get('/:id', ProductController.getById);

ProductsRouter.get('/category', ProductController.getByCategory);

ProductsRouter.get('/name', ProductController.getByName);

ProductsRouter.put('/:id', validateRegisterProduct, ProductController.updateProducts);

ProductsRouter.delete('/:id', ProductController.deleteProduct);

module.exports = ProductsRouter;