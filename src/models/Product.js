const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')

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

ProdutoSchema.plugin(mongoosePaginate)
mongoose.model('Product', ProdutoSchema);