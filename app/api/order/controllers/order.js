'use strict';
const IdentificationError = require("../../../utils/CustomError");

const {sanitizeEntity} = require('strapi-utils');
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {

  /**
   * Update a record.
   *
   * @return {Object}
   */
  async find(ctx) {
    try {
      const orders = await strapi.services.order.find({user: ctx.user.id})
      return orders.map(order => sanitizeEntity(order, {model: strapi.models.order}))
    } catch (e) {
      return Error(JSON.stringify({message: e.message}))
    }
  },


  async update(ctx) {
    try {
      const {id} = ctx.params;

      const decrypted = await strapi.plugins[
        'users-permissions'
        ].services.jwt.getToken(ctx);

      const _id = decrypted.id;

      const order = await strapi.query('order').model.findById(id)

      if (order.user.toString() !== _id.toString()) {
        IdentificationError('You can modify only self orders')
      }

      let entity;
      if (ctx.is('multipart')) {
        const {data, files} = parseMultipartData(ctx);
        entity = await strapi.services.order.update({id}, data, {
          files,
        });
      } else {
        entity = await strapi.services.order.update({id}, ctx.request.body);
      }

      return sanitizeEntity(entity, {model: strapi.models.order});
    } catch (e) {
      return Error(JSON.stringify({message: e.message}))
    }
  },
};
