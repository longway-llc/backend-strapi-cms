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

  async myController(ctx) {
    // ...

    // https://www.algolia.com/doc/api-reference/api-methods/
    const { client } = strapi.services.algolia
    await client.listIndices()

    // ...
  },
};
