const mongoose = require('mongoose');


// iniciando db
mongoose.connect(`mongodb://${process.env.db_user}:${process.env.db_pass}${process.env.db_host}`,
{ useNewUrlParser: true });



mongoose.Promise = global.Promise;
module.exports = mongoose;

