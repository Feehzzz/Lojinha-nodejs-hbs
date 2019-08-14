const mongoose = require('../database/server')

const OrderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  cart: {
    type: Object,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
})

const Order = mongoose.model('Order', OrderSchema)
module.exports = Order;