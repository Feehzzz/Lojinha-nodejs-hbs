const mongoose = require('mongoose');


// iniciando db
mongoose.connect('mongodb://root:0JlqGMp1HLPBV&T9d0soF6#S0SwL9z4Kc9!R5fim$oD@ds259207.mlab.com:59207/dbmaster',
{ useNewUrlParser: true });



mongoose.Promise = global.Promise;
module.exports = mongoose;

