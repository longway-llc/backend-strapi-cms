module.exports = ({ env }) => ({
  // ...
  email: {
    provider: 'gmail-2lo',
    providerOptions: {
      username: 'system@lwaero.net',
      clientId: env('EMAIL_CLIENT_ID'),
      privateKey: env('EMAIL_PRIVATE_KEY').replace(/\\n/g, '\n'),
    },
    settings: {
      defaultFrom: 'system@lwaero.net',
      defaultReplyTo: 'system@lwaero.net',
    },
  },
  // ...
});
