module.exports = {
  resolver: {
    Mutation: {
      requestQuote: {
        description: 'отправляет на почту запрос КП',
        policies: ['plugins::users-permissions.isAuthenticated'],
        resolverOf: 'application::product.product.requestQuote',
        resolver: async (_, {id}, {context}) => {
          const product = await strapi.services.product.findOne({id})

          await strapi.plugins['email'].services.email.send({
            to: context.state.user.email,
            from: 'system@lwaero.net',
            subject: `Request on ${product.pn}`,
            text: `
              Hello! You left a request for a cost of ${product.pn} on lwaero.net. Our manager contact with you at shotley time!
            `,
          })

          await strapi.plugins['email'].services.email.send({
            to: process.env.MANAGER_EMAIL,
            from: 'system@lwaero.net',
            subject: `Запрос КП на ${product.pn} от ${context.state.user.email}`,
            text: `
              Пользователь сайта: ${context.state.user.email} запросил КП на товар ${product.pn} ${product.uom}:
              https://lwaero.net/products/${product.id}
            `,
          })
          return 'Request successful created'
        }
      },
    },
  },
  mutation: `
    requestQuote(id: ID!): String,
  `,
}

