const {isDraft, sanitizeEntity} = require('strapi-utils').contentTypes;

const mongoose = require('mongoose')
const SyntheticCart = require('../../../utils/models/SyntheticCart')
const CartItem = require('../../../utils/models/CartItem')

module.exports = {
  resolver: {
    Query: {
      countProductsInCart: {
        _description: 'Обновляет количество продукта в корзине',
        policies: ['plugins::users-permissions.isAuthenticated'],
        resolverOf: 'application::cart.cart.count',
        resolver: async (_, args, {context}) => {
          const {cart: cartId} = context.state.user
          const cart = await strapi.services.cart.findOne({id: cartId});
          return cart.cartItems.reduce((acc, item) => acc + item.count, 0)
        }
      }
    },
    Mutation: {
      addToCart: {
        _description: 'Добавляет продукт в корзину пользователя, если он отсутствует, с указанным количеством, иначе добавляет количество к существующему',
        policies: ['plugins::users-permissions.isAuthenticated'],
        resolverOf: 'application::cart.cart.update',
        resolver: async (_, {productId, count}, {context}) => {
          mongoose.connect(process.env.DATABASE_URI, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
          const {cart: cartId} = context.state.user

          const userCart = await SyntheticCart.findById(cartId)
          const cartItems = await CartItem.find({
            _id: { $in: userCart.cartItems.map(item => item.ref) }
          })

          const isExist = cartItems.find(item => item.product.toString() === productId.toString())
          if (isExist) {
            isExist.count += count
            await isExist.save()
          } else {
            const newCartItem = new CartItem({
              product: productId,
              count
            })
            await newCartItem.save()
            userCart.cartItems.push({
              kind: "ComponentCartCartItem",
              ref: newCartItem.id
            })
            await userCart.save()
          }

          return await strapi.services.cart.findOne({id: cartId});
        }
      },
      changeProductCountInCart: {
        _description: 'Обновляет количество продукта в корзине',
        policies: ['plugins::users-permissions.isAuthenticated'],
        resolverOf: 'application::cart.cart.update',
        resolver: async (_, {productId, count}, {context}) => {
          mongoose.connect(process.env.DATABASE_URI, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
          const {id: userId, cart: cartId} = context.state.user

          const userCart = await SyntheticCart.findById(cartId)
          const cartItems = await CartItem.find({
            _id: { $in: userCart.cartItems.map(item => item.ref) }
          })

          const isExist = cartItems.find(item => item.product.toString() === productId.toString())
          if (isExist) {
            isExist.count = count
            await isExist.save()
          }

          return await strapi.services.cart.findOne({id: cartId});
        }
      },
      deleteProductFromCart: {
        _description: 'Обновляет количество продукта в корзине',
        policies: ['plugins::users-permissions.isAuthenticated'],
        resolverOf: 'application::cart.cart.update',
        resolver: async (_, {productId}, {context}) => {
          mongoose.connect(process.env.DATABASE_URI, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
          const {cart: cartId} = context.state.user

          const userCart = await SyntheticCart.findById(cartId)
          const cartItems = await CartItem.find({
            _id: { $in: userCart.cartItems.map(item => item.ref) }
          })

          const isExist = cartItems.find(item => item.product.toString() === productId.toString())
          if (isExist) {
            const deletedItem = userCart.cartItems.find(item => item.ref.toString() === isExist._id.toString())
            console.log(deletedItem)
            userCart.cartItems.pull({_id: deletedItem._id})
            await userCart.save()
            await CartItem.deleteOne({_id: isExist._id})
          }

          return await strapi.services.cart.findOne({id: cartId});
        }
      },
    },
  },
  query:`
    countProductsInCart: Int
  `,
  mutation: `
    addToCart (productId: ID!, count: Int): Cart,
    changeProductCountInCart (productId: ID!, count: Int!): Cart,
    deleteProductFromCart(productId: ID!): Cart,
  `,
}

