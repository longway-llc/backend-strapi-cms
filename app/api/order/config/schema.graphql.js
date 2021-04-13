const {sanitizeEntity} = require('strapi-utils');

const moment = require('moment')

module.exports = {
  resolver: {
    Mutation: {
      createOrderFromCart :{
        description: 'Создаёт заказ пользователя на основе его корзины',
        policies: ['plugins::users-permissions.isAuthenticated'],
        resolverOf: 'application::order.order.create',
        resolver: async (_, {region}, {context}) => {
          const {cart: cartId} = context.state.user

          const cart = await strapi.services.cart.findOne({id:cartId})
          const totalOrders = await strapi.services.order.count()
          const newOrder = await strapi.services.order.create({
            user: context.state.user.id,
            saleProductData: cart.cartItems.map(item => ({
                product: item.product.id.toString(),
                sellingPrice: region === 'ru' ? item.product.price_ru : item.product.price_en,
                count: item.count
              })),
            invoice: `${totalOrders + 1} from ${moment().format("MMM Do YY")}`
          })

          return sanitizeEntity(newOrder, { model: strapi.models.order })
        }
      },
    },
  },
  mutation: `
    createOrderFromCart(region: String!): Order!,
  `,
}

