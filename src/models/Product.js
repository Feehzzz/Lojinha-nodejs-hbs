const mongoose = require('../database/server')


const ProdutoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    lowercase: true,
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  url_img: {
    type: String,
    required: true
  }
})
const Product = mongoose.model('Product', ProdutoSchema)


module.exports = Product;