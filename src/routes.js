const express = require('express');
const routes = express.Router();

const ProductController = require('./controllers/ProductController');
const UserController = require('./controllers/UserController');
const MiddleController = require('./controllers/Middleware');


routes.get('/products', ProductController.index);
routes.post('/register', UserController.register);
routes.post('/auth', UserController.auth);
routes.post('/recovery_password', UserController.recovery);
routes.post('/reset_password', UserController.reset);

routes.use(MiddleController);

// rotas acessiveis para adm
routes.post('/products', ProductController.isADM, ProductController.store);
routes.put('/products/:id', ProductController.isADM, ProductController.update);
routes.delete('/products/:id', ProductController.isADM, ProductController.destroy);

module.exports = routes;