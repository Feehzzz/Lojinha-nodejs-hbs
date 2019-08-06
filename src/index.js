const express  = require('express')
const bodyParser = require('body-parser');
const cors = require('cors')
require('dotenv').config()
const webport = 3000 || process.env.webport

// iniciando o app
const app = express();

// entendendo as requisiçoes pela url e permite 
// que tenha acesso através de outro dominio pelo cors
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());


// importando as rotas definidas
app.use('/api', require('./routes'));

// inicialização do servidor
app.listen(webport, () => {
  console.log('Server is running localhost:'  +webport)
});

