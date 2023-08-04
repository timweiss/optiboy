const config = {
  port: process.env.APP_PORT || 3000,
  hostname: process.env.APP_HOSTNAME || `http://localhost:${process.env.APP_PORT || 3000}`,
  db: {
    connectionString: process.env.APP_DB_CONNECTION || 'postgres://optiboy:optiboy@localhost:5432/optiboy'
  },
  email: {
    notificationRecipient: process.env.APP_EMAIL_NOTIFICATION_RECIPIENT || null,
    sender: {
      name: process.env.APP_EMAIL_SENDER_NAME || 'optiboy',
      email: process.env.APP_EMAIL_SENDER || 'yourmail@example.com',
    },
    smtp: {
      host: process.env.APP_EMAIL_SMTP_HOST || 'localhost',
      port: parseInt(process.env.APP_EMAIL_SMTP_PORT || '587', 10),
      user: process.env.APP_EMAIL_SMTP_USER,
      password: process.env.APP_EMAIL_SMTP_PASSWORD
    }
  },
  admin: {
    enabled: process.env.APP_ADMIN_ENABLE === 'true' || false,
    secret: process.env.APP_ADMIN_SECRET || 'change-this-secret'
  }
};

export default config;