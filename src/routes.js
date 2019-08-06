const express = require('express');
const routes = express.Router();

const ProductController = require('./controllers/ProductController');
const UserController = require('./controllers/UserController');
const MiddleController = require('./controllers/Middleware');


routes.get('/products', ProductController.index);
routes.post('/register', UserController.register);
routes.post('/auth', UserController.auth);
routes.post('/recovery', UserController.recovery);

routes.use(MiddleController);

// rotas acessiveis para adm
routes.post('/products', ProductController.store);
routes.put('/products/:id', ProductController.update);
routes.delete('/products/:id', ProductController.destroy);

module.exports = routes;