'use strict';
module.exports = {
  lifecycles: {
    async afterCreate(data) {
      const {id} = data
      const cart = await strapi.services.cart.create()
      await strapi.query('user', 'users-permissions').update({id}, {cart: cart.id})
    },
  },
};
