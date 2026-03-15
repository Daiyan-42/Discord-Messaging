const dotenv = require('dotenv');

dotenv.config();

const env = {
  nodeEnv: process.env.NODE_ENV,
  port: Number(process.env.PORT),
  corsOrigin: process.env.CORS_ORIGIN,
};

module.exports = env;
