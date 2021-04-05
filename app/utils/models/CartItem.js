const mongoose = require('mongoose')

const Schema = mongoose.Schema

const cartSchema = new Schema({
  count: Number,
  product: {type: mongoose.Types.ObjectId}
})

const CartItem = mongoose.model('CartItem', cartSchema, 'components_cart_cart_items')

module.exports =  CartItem
