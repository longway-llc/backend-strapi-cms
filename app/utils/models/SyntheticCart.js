const mongoose = require('mongoose')

const Schema = mongoose.Schema

const cartSchema = new Schema({
    cartItems: [
      {
        kind: String,
        ref: {type: mongoose.Types.ObjectId, ref: 'CartItem'}
      }
    ]
  },
  {timestamp: true}
)

const SyntheticCart = mongoose.model('SyntheticCart', cartSchema, 'carts')

module.exports = SyntheticCart
