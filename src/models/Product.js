const mongoose = require('mongoose')


const ProdutoSchema = new mongoose.Schema({
  title: {
    type: String,
    require: true
  },
  price: {
    type: Number,
    require: true
  },
  quantity: {
    type: Number,
    required: true
  }
})
const Product = mongoose.model('Product', ProdutoSchema)


module.exports = Product;