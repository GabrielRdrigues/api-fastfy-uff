import 'dotenv/config';

function port(value: string | undefined, fallback: number): number {
  const parsed = Number(value || fallback);
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 65535) {
    throw new Error('A porta deve ser um número inteiro entre 1 e 65535.');
  }
  return parsed;
}

const postgres = {
  host: process.env.POSTGRES_HOST || 'localhost',
  port: port(process.env.POSTGRES_PORT, 5433),
  user: process.env.POSTGRES_USER || 'manager-api',
  password: process.env.POSTGRES_PASSWORD || '',
  database: process.env.POSTGRES_DB || 'pokemon-manager',
};

const databaseUrl =
  process.env.DATABASE_URL ||
  `postgresql://${encodeURIComponent(postgres.user)}:${encodeURIComponent(postgres.password)}@${postgres.host}:${postgres.port}/${encodeURIComponent(postgres.database)}?schema=public`;

export const env = {
  port: port(process.env.PORT, 3333),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl,
  postgres,
  useExternalApi: process.env.USE_EXTERNAL_API?.toLowerCase() !== 'false',
};
