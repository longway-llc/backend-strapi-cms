'use strict';
const {sanitizeEntity} = require('strapi-utils');
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async findByReference(ctx) {
    const {id} = ctx.params
    const {pn} = await strapi.services.product.findOne({id})
    const productsWithSamePN = await strapi.services.product.find({pn})
    return sanitizeEntity(productsWithSamePN, { model: strapi.models.product });
  },

  async getAvailableIds(ctx) {
    const showProducts = await strapi.query('product').find({deletedFromSearch: false})
    return showProducts.map(p => p._id)
  },

  async requestQuote(ctx) {
    const {id} = ctx.params
    const product = await strapi.services.product.findOne({id})

    await strapi.plugins['email'].services.email.send({
      to: ctx.user.email,
      from: 'system@lwaero.net',
      subject: `Request on ${product.pn}`,
      text: `
          Hello! You left a request for a cost of ${product.pn} on lwaero.net. Our manager contact with you at shotley time!
        `,
    });

    await strapi.plugins['email'].services.email.send({
      to: process.env.MANAGER_EMAIL,
      from: 'system@lwaero.net',
      subject: `Запрос КП на ${product.pn} от ${ctx.user.email}`,
      text: `
          Пользователь сайта: ${ctx.user.email} запросил КП на товар ${product.pn} ${product.uom}:
          httts://lwaero.net/products/${product.id}
        `,
    });
    return 'Request successful created'
  },
  async myController(ctx) {
    // ...

    // https://www.algolia.com/doc/api-reference/api-methods/
    const { client } = strapi.services.algolia
    await client.listIndices()

    // ...
  },
};
