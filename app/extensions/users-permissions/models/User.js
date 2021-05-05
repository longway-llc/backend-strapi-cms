'use strict';
module.exports = {
  lifecycles: {
    async afterCreate(data) {
      const {id} = data
      const cart = await strapi.services.cart.create()
      await strapi.query('user', 'users-permissions').update({id}, {cart: cart.id})

      await strapi.plugins['email'].services.email.send({
        to: process.env.MANAGER_EMAIL || "sales@lwaero.net",
        from: 'LWAero Store <system@lwaero.net>',
        subject: `Новый пользователь на сайте: ${data.email}`,
        text: `
              На сайте авторизовался новый пользователь. Email: ${data.email}
            `,
      })
    },
  },
};
