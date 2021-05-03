'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */

module.exports = {
  lifecycles: {
    async afterCreate(result, data) {
      await strapi.plugins['email'].services.email.send({
        to: result.user.email,
        from: 'system@lwaero.net',
        subject: `New order: ${result.invoice}`,
        text: `
          Hello! You create an order on lwaero.net. Can see details in personal cabinet on link: https://lwaero.net/cabinet/orders
        `,
      });

      await strapi.plugins['email'].services.email.send({
        to: process.env.MANAGER_EMAIL,
        from: 'system@lwaero.net',
        subject: `Новый заказ lwaero.net от ${result.user.email}`,
        text: `
          Пользователь сайта ${result.user.email} создал заказ. \n
          Контактный телефон: ${result.user.phone}. \n
          Детали заказа в панели администратора: https://api.lwaero.net/admin/plugins/content-manager/collectionType/application::order.order/${result.id}
        `,
      });

    },
  },
};
