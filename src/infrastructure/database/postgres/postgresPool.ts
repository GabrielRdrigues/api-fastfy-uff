import { Pool } from 'pg';
import { env } from '@main/config/env';

export const postgresPool = new Pool({
  ...(env.databaseUrl ? { connectionString: env.databaseUrl } : env.postgres),
  connectionTimeoutMillis: 5000,
  idleTimeoutMillis: 30000,
});

postgresPool.on('error', (error: Error) => {
  console.error('Erro em uma conexão ociosa do PostgreSQL:', error.message);
});
