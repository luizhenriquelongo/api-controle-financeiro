import dotenv from 'dotenv';
dotenv.config();

const TYPEORM_HOST = process.env.DB_CONTAINER_NAME;
const TYPEORM_PORT = Number(process.env.TYPEORM_PORT);
const TYPEORM_USERNAME = process.env.POSTGRES_USER;
const TYPEORM_PASSWORD = process.env.POSTGRES_PASSWORD;
const TYPEORM_DATABASE = process.env.POSTGRES_DB;
const API_KEY = process.env.API_KEY;

export {
  TYPEORM_PORT,
  TYPEORM_HOST,
  TYPEORM_PASSWORD,
  TYPEORM_DATABASE,
  TYPEORM_USERNAME,
  API_KEY
};
