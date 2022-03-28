import dotenv from 'dotenv';
dotenv.config();

const TYPEORM_HOST = process.env.TYPEORM_HOST;
const TYPEORM_PORT = Number(process.env.TYPEORM_PORT);
const TYPEORM_USERNAME = process.env.TYPEORM_USERNAME;
const TYPEORM_PASSWORD = process.env.TYPEORM_PASSWORD;
const TYPEORM_DATABASE = process.env.TYPEORM_DATABASE;
const API_KEY = process.env.API_KEY;

export {
  TYPEORM_PORT,
  TYPEORM_HOST,
  TYPEORM_PASSWORD,
  TYPEORM_DATABASE,
  TYPEORM_USERNAME,
  API_KEY
};
