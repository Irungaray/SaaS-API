import { DataSource } from 'typeorm';

export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  entities: ['dist/**/*.entity{.ts,.js}', 'dist/**/*.view{.ts,.js}'],
  migrations: ['src/migrations/**/*{.ts,.js}'],
  ssl: {
    rejectUnauthorized: false,
  },
});
