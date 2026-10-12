import { app } from '@main/app';
import { env } from '@main/config/env';
import { prisma } from '@infrastructure/database/prisma/client';

async function start(): Promise<void> {
  try {
    // Testa o banco antes de abrir a API.
    await prisma.$queryRaw`SELECT 1`;
    const server = app.listen(env.port, '0.0.0.0', () => {
      console.log(`API rodando em http://localhost:${env.port}`);
      console.log(`Swagger: http://localhost:${env.port}/api/docs`);
    });
    server.on('error', async (error) => {
      console.error('Falha ao iniciar o servidor:', error.message);
      await prisma.$disconnect();
      process.exitCode = 1;
    });
    const shutdown = (): void => {
      // Ao encerrar, para de aceitar reqs e espera os atuais antes de desconectar.
      server.close(() => {
        void prisma.$disconnect();
      });
    };
    process.once('SIGINT', shutdown);
    process.once('SIGTERM', shutdown);
  } catch (error) {
    console.error(
      'Falha ao conectar ao PostgreSQL:',
      error instanceof Error ? error.message : 'Erro desconhecido',
    );
    await prisma.$disconnect();
    process.exitCode = 1;
  }
}

void start();
