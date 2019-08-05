const express = require('express');
const routes = express.Router();

const ProductController = require('./controllers/ProductController');
const UserController = require('./controllers/UserController');
const MiddleController = require('./controllers/Middleware');
const test = require('./controllers/test');

routes.get('/products', ProductController.index);
routes.get('/products/:id', ProductController.show);
routes.post('/products', ProductController.store);
routes.put('/products/:id', ProductController.update);
routes.delete('/products/:id', ProductController.destroy);
routes.post('/register', UserController.register);
routes.post('/auth', UserController.auth);
routes.use(MiddleController);
routes.get('/', test.check);
module.exports = routes;