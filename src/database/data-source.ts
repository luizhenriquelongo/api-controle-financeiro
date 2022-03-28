import 'reflect-metadata';
import { DataSource } from 'typeorm';
import {
  TYPEORM_DATABASE,
  TYPEORM_HOST,
  TYPEORM_PASSWORD,
  TYPEORM_USERNAME,
  TYPEORM_PORT
} from '../config';

export const postgresDataSource = new DataSource({
  type: 'postgres',
  host: TYPEORM_HOST,
  port: TYPEORM_PORT,
  username: TYPEORM_USERNAME,
  password: TYPEORM_PASSWORD,
  database: TYPEORM_DATABASE,
  entities: ['src/database/entities/*.ts'],
  logging: true,
  migrations: ['src/database/migrations/*.ts']
});
