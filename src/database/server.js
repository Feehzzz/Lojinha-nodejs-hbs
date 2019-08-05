const mongoose = require('mongoose');
const bodyParser = require('body-parser')
const cors = require('cors')
const express = require('express');
const requireDIr = require('require-dir');
const port = 3000


// iniciando o app
const app = express();

// entendendo as requisiçoes pela url e permite 
// que tenha acesso através de outro dominio pelo cors
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());

// iniciando db
mongoose.connect('mongodb://root:0JlqGMp1HLPBV&T9d0soF6#S0SwL9z4Kc9!R5fim$oD@ds259207.mlab.com:59207/dbmaster',
{ useNewUrlParser: true });
require('../models/Product');


const Product = mongoose.model('Product');

// importando as rotas definidas
app.use('/api', require('../routes'));



app.listen(port, () => {
  console.log('Server is running localhost:'  +port)
});

module.exports = mongoose;

