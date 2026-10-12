import { z } from 'zod';

export const searchPokedexQuerySchema = z.object({
  name: z
    .string({ required_error: 'Informe o nome do Pokémon' })
    .trim()
    .min(2, 'O nome deve ter no mínimo 2 caracteres')
    .max(150),
});
