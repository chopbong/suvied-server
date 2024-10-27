import "dotenv/config";

export const env = {
  APP_PORT: process.env.APP_PORT,
  APP_HOST: process.env.APP_HOST,
  ORIGIN: process.env.ORIGIN,

  MONGO_URI: process.env.MONGO_URI,
  DATABASE_NAME: process.env.DATABASE_NAME,

  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,

  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_AUTH_USER: process.env.SMTP_AUTH_USER,
  SMTP_AUTH_PASSWORD: process.env.SMTP_AUTH_PASSWORD,

  BUILD_MODE: process.env.BUILD_MODE,
};
