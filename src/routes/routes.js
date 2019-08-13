const express = require('express');
const routes = express.Router();
const passport = require('passport')
const product = require('../models/Product')
const Cart = require('../models/Cart')

 
const ProductC = require('../controllers/ProductController');
const UserC = require('../controllers/UserController');
const MiddleController = require('../controllers/Middleware');

routes.post('/login', (req,res, next) => {
    passport.authenticate('local', {
        successRedirect: '/profile',
        failureRedirect:'/login',
        failureFlash: true
    })(req,res,next)
});

routes.get('/login', UserC.notLogged, UserC.authGET);
routes.get('/register', UserC.notLogged, UserC.registerGET);
routes.post('/register', UserC.register);


routes.get('/', ProductC.index);
routes.get('/profile', UserC.LoggedIn, (req,res) => {
    let date = req.user.createdAt
    res.render('user/profile',{since: date.toLocaleDateString()} )
})

routes.get('/forgot', UserC.forgotGet);
routes.get('/logout', UserC.Logout);

routes.get('/add-to-cart/:id', (req,res) => {
    let productId = req.params.id;
    let cart = new Cart(req.session.cart ? req.session.cart : {})
    product.findById(productId, (err, product) => {
        if(err) return res.redirect('/');
        cart.add(product, product.id);
        req.session.cart = cart;
        res.redirect('/')
    })
    
});


routes.get('/shopping-cart', (req,res) => {
    if(!req.session.cart){
        return res.render('shop/cart', {products: null})
    }
    let cart = new Cart(req.session.cart);
    return res.render('shop/cart', {products: cart.generateArray(), totalPrice: cart.totalPrice});
});
routes.get('/checkout', UserC.LoggedIn, (req,res) =>{
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    let cart = new Cart(req.session.cart);
   return res.render('shop/checkout', {total: cart.totalPrice, user: req.user })

})

// // routes.use(MiddleController);

// // rotas acessiveis para adm
routes.post('/products', ProductC.store);
routes.get('/getall', async (req,res) => {
    const items = await product.find()
    return res.json(items)
})


module.exports = routes;