module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  url: env('URL', undefined),
  admin: {
    auth: {
      secret: env('ADMIN_JWT_SECRET', '7d8946156ee2646b6277a8696a1b1e4f'),
    },
  },
});
