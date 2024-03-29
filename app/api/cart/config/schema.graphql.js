const {sanitizeEntity} = require('strapi-utils');

const mongoose = require('mongoose')
const SyntheticCart = require('../../../utils/models/SyntheticCart')
const CartItem = require('../../../utils/models/CartItem')

module.exports = {
  resolver: {
    Query: {
      countProductsInCart: {
        description: 'Обновляет количество продукта в корзине',
        policies: ['plugins::users-permissions.isAuthenticated'],
        resolverOf: 'application::cart.cart.count',
        resolver: async (_, args, {context}) => {
          const {cart: cartId} = context.state.user
          const cart = await strapi.services.cart.findOne({id: cartId});
          return cart.cartItems.reduce((acc, item) => acc + item.count, 0)
        }
      },
      getCart: {
        description: 'Получает корзину авторизованного пользователя',
        policies: ['plugins::users-permissions.isAuthenticated'],
        resolverOf: 'application::cart.cart.findOne',
        resolver: async (_, args, {context}) => {
          const {cart: cartId} = context.state.user
          const cart = await strapi.services.cart.findOne({id: cartId})
          return sanitizeEntity(cart, {model: strapi.models.cart})
        }
      }
    },
    Mutation: {
      addToCart: {
        description: 'Добавляет продукт в корзину пользователя, если он отсутствует, с указанным количеством, иначе добавляет количество к существующему',
        policies: ['plugins::users-permissions.isAuthenticated'],
        resolverOf: 'application::cart.cart.update',
        resolver: async (_, {productId, count}, {context}) => {
          mongoose.connect(process.env.DATABASE_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
          })
          const {cart: cartId} = context.state.user

          const userCart = await SyntheticCart.findById(cartId)
          const cartItems = await CartItem.find({
            _id: {$in: userCart.cartItems.map(item => item.ref)}
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

          const updatedCart = await strapi.services.cart.findOne({id: cartId});
          return sanitizeEntity(updatedCart, {model: strapi.models.cart})
        }
      },
      changeProductCountInCart: {
        description: 'Обновляет количество продукта в корзине',
        policies: ['plugins::users-permissions.isAuthenticated'],
        resolverOf: 'application::cart.cart.update',
        resolver: async (_, {productId, count}, {context}) => {
          mongoose.connect(process.env.DATABASE_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
          })
          const {id: userId, cart: cartId} = context.state.user

          const userCart = await SyntheticCart.findById(cartId)
          const cartItems = await CartItem.find({
            _id: {$in: userCart.cartItems.map(item => item.ref)}
          })

          const isExist = cartItems.find(item => item.product.toString() === productId.toString())
          if (isExist) {
            isExist.count = count
            await isExist.save()
          }

          const cart = await strapi.services.cart.findOne({id: cartId});
          return sanitizeEntity(cart, {model: strapi.models.cart})
        }
      },
      deleteProductFromCart: {
        description: 'Обновляет количество продукта в корзине',
        policies: ['plugins::users-permissions.isAuthenticated'],
        resolverOf: 'application::cart.cart.update',
        resolver: async (_, {productId}, {context}) => {
          mongoose.connect(process.env.DATABASE_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
          })
          const {cart: cartId} = context.state.user

          const userCart = await SyntheticCart.findById(cartId)
          const cartItems = await CartItem.find({
            _id: {$in: userCart.cartItems.map(item => item.ref)}
          })

          const isExist = cartItems.find(item => item.product.toString() === productId.toString())
          if (isExist) {
            const deletedItem = userCart.cartItems.find(item => item.ref.toString() === isExist._id.toString())
            userCart.cartItems.pull({_id: deletedItem._id})
            await userCart.save()
            await CartItem.deleteOne({_id: isExist._id})
          }

          const cart = await strapi.services.cart.findOne({id: cartId});
          return sanitizeEntity(cart, {model: strapi.models.cart})
        }
      },
      resetCart: {
        description: 'Очищает корзину',
        policies: ['plugins::users-permissions.isAuthenticated'],
        resolverOf: 'application::cart.cart.update',
        resolver: async (_, args, {context}) => {
          const {cart: cartId} = context.state.user
          const updatedCart = await strapi.services.cart.update({id: cartId}, {cartItems: []})
          return sanitizeEntity(updatedCart, {model: strapi.models.cart})
        }
      }
    },
  },
  query: `
    countProductsInCart: Int
    getCart: Cart!
  `,
  mutation: `
    addToCart (productId: ID!, count: Int): Cart!,
    changeProductCountInCart (productId: ID!, count: Int!): Cart!,
    deleteProductFromCart(productId: ID!): Cart!,
    resetCart: Cart!
  `,
}
