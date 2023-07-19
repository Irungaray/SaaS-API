import { Logger } from '@nestjs/common';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import * as fs from 'fs';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

class ConfigService {
  private readonly logger = new Logger(ConfigService.name);

  constructor(private env: { [k: string]: string | undefined }) {}

  private getValue(key: string): string {
    const value = this.env[key];

    if (!value) {
      throw new Error(`
        Config error - missing .env.${key}

        Check if the .env file even exists, then check for ${key} var. \n
      `);
    }

    return value;
  }

  public ensureValues(): this {
    const vars = fs.readFileSync('./.env').toString('utf-8');
    const lines = vars.trim().replace('\n', '').split('\n');
    const keys = lines.map((line) => line.split('=')[0]);

    for (const key of keys) {
      this.getValue(key);
    }

    return this;
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    this.logger.warn(`DDBB: Connected to ${this.env.DB_NAME} with username ${this.env.DB_USERNAME}`);

    return {
      type: 'postgres',
      username: this.env.DB_USERNAME,
      password: this.env.DB_PASSWORD,
      host: this.env.DB_HOST,
      port: Number(this.env.DB_PORT),
      database: this.env.DB_NAME,
      cache: true,
      entities: ['dist/**/*.entity{.ts,.js}', 'dist/**/*.view{.ts,.js}'],
      logging: this.env.DATABASE_LOGGING === 'true',
      ssl: { rejectUnauthorized: false },
    };
  }
}

const configService = new ConfigService(process.env).ensureValues();

export { configService };
