module.exports = {
  definition: `
    extend type UsersPermissionsMe {
      user: UsersPermissionsUser,
      cart: Cart
    }
  `,
  resolver: {
    UsersPermissionsMe: {
      user: user => user,
      cart: cart => cart
    },
  }
}

