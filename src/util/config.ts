const config = {
  port: process.env.APP_PORT || 3000,
  db: {
    connectionString: process.env.APP_DB_CONNECTION || 'postgres://optiboy:optiboy@localhost:5432/optiboy'
  }
};

export default config;