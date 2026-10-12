import express from 'express';
import pokemonRoutes from '@infrastructure/http/routes/pokemonRoutes';
import trainerRoutes from '@infrastructure/http/routes/trainerRoutes';
import pokedexRoutes from '@infrastructure/http/routes/pokedexRoutes';
import { errorHandler } from '@infrastructure/http/middlewares/errorHandler';
import { prisma } from '@infrastructure/database/prisma/client';
import { setupSwagger } from '@main/config/swagger';

export const app = express();
// O caminho do pedido: rota -> validação -> controller -> caso de uso -> repositório.
app.use(express.json());
app.get('/', (_req, res) => {
  res.json({ message: 'PokéManager API', docs: '/api/docs' });
});
app.get('/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'ok', database: 'connected' });
  } catch {
    res.status(503).json({ status: 'unavailable', database: 'disconnected' });
  }
});
setupSwagger(app);
app.get('/swagger', (_req, res) => {
  res.redirect('/api/docs');
});
app.use('/api/v1/pokemons', pokemonRoutes);
app.use('/api/v1/trainers', trainerRoutes);
app.use('/api/v1/pokedex', pokedexRoutes);
app.use((_req, res) => {
  res.status(404).json({ status: 'error', message: 'Rota não encontrada.' });
});
// Fica por último para receber os erros que vierem das rotas e middlewares.
app.use(errorHandler);
