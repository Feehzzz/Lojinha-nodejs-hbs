const express = require('express');
const routes = express.Router();
const passport = require('passport');
const product = require('../models/Product');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const User = require('../models/User')
const csrf = require('csurf');
const csrfProtection = csrf();
routes.use(csrfProtection)
 
const ProductC = require('../controllers/ProductController');
const UserC = require('../controllers/UserController');
// const MiddleController = require('../controllers/Middleware');


// rota post para efetuar login
routes.post('/login', (req,res, next) => {
    passport.authenticate('local', {
        successRedirect: '/profile',
        failureRedirect:'/login',
        failureFlash: true
    })(req,res,next)
});

// rota get para renderizar pagina de login
routes.get('/login', UserC.notLogged, UserC.authGET);

// rota get para renderizar pagina de registro
routes.get('/register', UserC.notLogged, UserC.registerGET);

// rota post para efetuar registro
routes.post('/register', UserC.register);

// index que renderiza os itens
routes.get('/', ProductC.index);

// rota que rendediza o perfil do usuario
routes.get('/profile', UserC.LoggedIn, (req,res) => {
    let date = req.user.createdAt
    Order.find({user: req.user},(err, orders) =>{
        if(err) return res.write('error')
        let cart;
    orders.forEach((order) => {
        cart = new Cart(order.cart);
        order.items = cart.generateArray();
    })
    res.render('user/profile',{since: date.toLocaleDateString().split('-').reverse().join('-'), orders: orders, title:'Profile'})
    })
})
// rota para renderizar
routes.get('/forgot', UserC.forgotGet);
// logout
routes.get('/logout', UserC.Logout);

// "função" para adicionar itens ao carrinho
routes.get('/add-to-cart/:id', (req,res) => {
    let productId = req.params.id;
    let cart = new Cart(req.session.cart ? req.session.cart : {})
    product.findById(productId, (err, product) => {
        if(err) res.redirect('/');

        if(product.quantity > 0){
            cart.add(product, product.id);
            req.session.cart = cart;
            req.flash('success_msg','Produto adicionado ao carrinho')
            res.redirect('/')
        } else {
            req.flash('error_msg','Produto fora de estoque')
            res.redirect('/')
        }  
    })
});
// "função" para remover itens do carrinho
routes.get('/reduce/:id', (req,res) => {
    let productId = req.params.id;
    let cart = new Cart(req.session.cart ? req.session.cart : {})
    req.flash('success_msg','Produto removido')
    cart.reduce(productId)
    req.session.cart = cart;
    res.redirect('/shopping-cart')
});
// incrementar itens do carrinho
routes.get('/increment/:id', (req,res) => {
    let productId = req.params.id;
    let cart = new Cart(req.session.cart ? req.session.cart : {})
    product.findById(productId, (err, product) => {
        if(err) res.redirect('/');
        cart.add(product, product.id);
        req.session.cart = cart;
        req.flash('success_msg','Produto incrementado')
        res.redirect('/shopping-cart')
    })
});
// rota para renderizar carrinho com os produtos
routes.get('/shopping-cart',  async(req,res) => {
    if(!req.session.cart){
        return res.render('shop/cart', {products: null})
    }
    let cart = new Cart(req.session.cart);
    res.render('shop/cart', {products: cart.generateArray(), totalPrice: cart.totalPrice, title: 'Shopping cart'});
});
// rota para renderizar o resumo da compra
routes.get('/checkout', UserC.LoggedIn, (req,res) =>{
    let erros = []
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    let cart = new Cart(req.session.cart);
    cart.totalPrice > req.user.wallet ? erros.push('Saldo insuficiente'): 0
    res.render('shop/checkout', {csrfToken: req.csrfToken(),total: cart.totalPrice, user: req.user, erros: erros})
})
// rota para finalizar compra
routes.post('/checkout', UserC.LoggedIn,  async(req,res) =>{
    if (!req.session.cart) {
        return res.redirect('/shopping-cart');
    }
    let cart = new Cart(req.session.cart)
    if(req.user.wallet >= cart.totalPrice){
        let order =  new Order({
            user: req.user,
            cart});
        order.save(()=>{
            User.findOneAndUpdate({_id: req.user},{wallet: req.user.wallet -= cart.totalPrice}).then(() =>{})
            for(id in cart.items){
                product.findById(id, (err, item) =>{
                    if(err) return err
                    item.quantity --
                    item.save()
                })
            }
            req.flash('success_msg','Compra efetuada com sucesso!');
            req.session.cart = null;
            res.redirect('/')
        });
    } else {
        req.flash('error_msg','Saldo insuficiente para efetuar essa compra');
        res.redirect('/shopping-cart');
    }
});



// // rotas acessiveis para adm
routes.get('/products', UserC.isAdmin, ProductC.renderProduct);
routes.post('/products', UserC.isAdmin, ProductC.store);


// post para enviar email de recuperação
routes.post('/forgot', UserC.recovery);
// rota get para renderizar pagina de reset
routes.get('/reset', UserC.resetGet);

// rota para reset de login
routes.post('/reset', UserC.reset);



module.exports = routes;