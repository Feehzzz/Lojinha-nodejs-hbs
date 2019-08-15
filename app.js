const express  = require('express')
const bodyParser = require('body-parser');
const handlebars = require('express-handlebars')
require('dotenv').config();
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const path = require('path');
const mongoose = require('./src/database/server')
const mongoStore = require('connect-mongo')(session);


require('./config/passport')(passport)
// iniciando o app
const app = express();

// entendendo as requisiçoes pela url
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(session({
  secret: process.env.secret, 
  resave: false, 
  saveUninitialized: false, 
  store: new mongoStore({ mongooseConnection: mongoose.connection}),
  cookie: { maxAge: 180 * 10 * 1000}
}));
app.use(flash()); // captura as mensagens de erro
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, './public')));

// template engine
app.engine('.hbs', handlebars({defaultLayout: '../main', extname: '.hbs'}));
app.set('view engine', '.hbs');

// express session
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

app.use((req,res,next) =>{
  res.locals.login = req.isAuthenticated();
  res.locals.session = req.session;
  res.locals.user = req.user;
  next();
})

// importando as rotas definidas
app.use('/',require('./src/routes/routes'));

// inicialização do servidor
app.listen(process.env.port || 3000, () => {
  console.log('Server is running')
});

