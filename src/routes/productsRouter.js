const { Router } = require('express');
const ProductController = require('../controllers/ProductsController');

const ProductsRouter = new Router();

ProductsRouter.post('/', ProductController.registerProduct);

ProductsRouter.get('/', ProductController.getAll);

ProductsRouter.get('/:id', ProductController.getById);

ProductsRouter.put('/:id', ProductController.updateProducts);

ProductsRouter.delete('/:id', ProductController.deleteProduct);

module.exports = ProductsRouter;