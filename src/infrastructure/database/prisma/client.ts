import { PrismaClient } from '@prisma/client';
import { env } from '@main/config/env';

export const prisma = new PrismaClient({
  datasources: { db: { url: env.databaseUrl } },
  log:
    env.nodeEnv === 'test'
      ? []
      : env.nodeEnv === 'development'
        ? ['error', 'warn']
        : ['error'],
});
