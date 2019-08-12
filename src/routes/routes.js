const express = require('express');
const routes = express.Router();
const passport = require('passport')


const Product = require('../controllers/ProductController');
const User = require('../controllers/UserController');
const MiddleController = require('../controllers/Middleware');

routes.get('/', (req, res, next ) =>{
    
res.render('layouts/index')
})


routes.post('/login', User.notLoggedIn, (req,res, next) => {
    passport.authenticate('local', {
        successRedirect: '/profile',
        failureRedirect:'/login',
        failureFlash: true
    })(req,res,next)
});

routes.get('/login', User.notLoggedIn, User.authGET);
routes.get('/register', User.isLoggedIn, User.registerGET);
routes.post('/register', User.register);


// routes.get('/', ProductController.index)
    // let productArray = []
    // let wrap = 3;
    // for(i=0; i< itens.length; i += wrap){
    //   productArray.push(itens.slice(i, i + wrap));
    // }
    // res.render('layouts/index', {title: 'Shopping cart', product: productArray })



routes.get('/profile', User.isLoggedIn, (req,res) =>{
    res.render('user/profile')
})

routes.get('/forgot', User.forgotGet)
routes.get('/logout', (req,res) => {
    req.logout();
    res.redirect('/')
})

// routes.get('/logout', (req, res) => {
//   req.logout();
//   req.flash('success_msg', 'You are logged out');
//   res.redirect('user/signin');
// });

// // routes.use(MiddleController);

// // rotas acessiveis para adm
// routes.post('/products', ProductController.isADM, ProductController.store);
// routes.put('/products/:id', ProductController.isADM, ProductController.update);
// routes.delete('/products/:id', ProductController.isADM, ProductController.destroy);

module.exports = routes;