const mongoose = require('mongoose');

// iniciando db
mongoose.connect(`mongodb+srv://${process.env.db_user}:${process.env.db_pass}@cluster0.r7v6p.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,{useNewUrlParser: true, useCreateIndex: true});



mongoose.Promise = global.Promise;
module.exports = mongoose;

