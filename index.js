const express = require('express');
const bodyParser = require('body-parser');
const {sendError} = require('./src/errorHandler/errorHandler');
const app = express();
const port = 3000;
const ProductsRouter = require('./src/routes/productsRouter');

app.use(bodyParser.json());

app.use('/products', ProductsRouter);

app.use((err, _req, res, _next) => {
  sendError(err, res);
});

app.listen(port, () => console.log(`Listening to port ${port}`));