import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { postgresPool } from './postgresPool';

async function migrate(): Promise<void> {
  try {
    const sql = await readFile(
      path.resolve(process.cwd(), 'database/001_create_tables.sql'),
      'utf8',
    );
    await postgresPool.query(sql);
    console.log('Tabelas pokemons e trainers prontas.');
  } catch (error) {
    console.error(
      'Falha ao criar as tabelas:',
      error instanceof Error ? error.message : 'Erro desconhecido',
    );
    process.exitCode = 1;
  } finally {
    await postgresPool.end();
  }
}

void migrate();
