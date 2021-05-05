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
        from: 'LWAero Store <system@lwaero.net>',
        subject: `New order: ${result.invoice}`,
        text: `
          Hello! You create an order on lwaero.net. Can see details in personal cabinet on link: https://lwaero.net/cabinet/orders
        `,
        html: `
            <!DOCTYPE html>
                        <html lang="en">
                        <head>
                        <title>Order on site LWaero.net</title>
                        <style>
                            table, th, td {
                              border: 1px solid black;
                            }
                        </style>
                        </head>
                        <body>
                        <h4>Hello! You create an order on lwaero.net!</h4>
                        <hr/>
                        <span>Total positions: <b>${result.saleProductData.length}</b></span>
                        <br/>
                        <span>Total cost: <b>${result.saleProductData.reduce((acc, product) => acc + (product.sellingPrice * product.count), 0)}</b> USD</span>
                        <br/>
                        <table>
                            <caption>Details:</caption>
                            <thead>
                                <tr><th>P/N</th><th>UOM</th><th>Color</th><th>Count</th><th>Selling price</th><th>Cost</th></tr>
                            </thead>
                            <tbody>
                                ${result.saleProductData.map((p) => `<tr><td>${p.product.pn}</td><td>${p.product.uom}</td><td>${p.product.color}</td><td>${p.count}</td><td>${p.sellingPrice}</td><td>${p.count * p.sellingPrice}</td></tr>`).join('')}
                            </tbody>
                        </table>
                        <hr/>
                        <span>Can see details in personal cabinet on </span>
                        <a href="https://lwaero.net/cabinet/orders">this link</a>
                        </body>
                        </html>
                    `
      });


      await strapi.plugins['email'].services.email.send({
        to: process.env.MANAGER_EMAIL || "sales@lwaero.net",
        from: 'LWAero Store <system@lwaero.net>',
        subject: `Новый заказ lwaero.net от ${result.user.email}`,
        text: `
            Пользователь сайта ${result.user.email} создал заказ. \n
            Контактный телефон: ${result.user.customerInfo.phone}. \n
            Детали заказа в панели администратора: https://api.lwaero.net/admin/plugins/content-manager/collectionType/application::order.order/${result.id}
        `,
        html: `
            <!DOCTYPE html>
                        <html lang="ru">
                        <head>
                        <title>Новый заказ на сайте</title>
                        <style>
                            table, th, td {
                              border: 1px solid black;
                            }
                        </style>
                        </head>
                        <body>
                        <h4>Пользователь сайта ${result.user.email} создал заказ.</h4>
                        <hr/>
                        <span>Контактный телефон: ${result.user.customerInfo.phone}</b></span>
                        <br/>
                        <span>Всего позиций: <b>${result.saleProductData.length}</b></span>
                        <br/>
                        <span>Общая стоимость: <b>${result.saleProductData.reduce((acc, product) => acc + (product.sellingPrice * product.count), 0)}</b> USD</span>
                        <br/>
                        <table>
                            <caption>Детали заказа:</caption>
                            <thead>
                                <tr><th>P/N</th><th>UOM</th><th>Цвет</th><th>Количество</th><th>Цена продажи</th><th>Сумма</th></tr>
                            </thead>
                            <tbody>
                                ${result.saleProductData.map((p) => `<tr><td>${p.product.pn}</td><td>${p.product.uom}</td><td>${p.product.color}</td><td>${p.count}</td><td>${p.sellingPrice}</td><td>${p.count * p.sellingPrice}</td></tr>`).join('')}
                            </tbody>
                        </table>
                        <hr/>
                        <span>Детали заказа в</span>
                        <a href="https://api.lwaero.net/admin/plugins/content-manager/collectionType/application::order.order/${result.id}">
                            панели администратора
                        </a>
                        </body>
                        </html>
        `
      });

    },
  },
};
