import { z } from 'zod';

// Esta lista limita o tipo enviado nos pedidos e filtros; não cobre toda a PokéAPI.
export const pokemonTypes = [
  'FIRE',
  'WATER',
  'GRASS',
  'ELECTRIC',
  'POISON',
  'FLYING',
] as const;

const pokemonTypeSchema = z.preprocess(
  (value) => (typeof value === 'string' ? value.trim().toUpperCase() : value),
  z.enum(pokemonTypes, {
    errorMap: () => ({
      message: `O tipo deve ser um destes valores: ${pokemonTypes.join(', ')}`,
    }),
  }),
);

const pokemonIdSchema = z
  .string({ required_error: 'O ID é obrigatório' })
  .trim()
  .min(1, 'O ID é obrigatório')
  .max(100, 'O ID deve ter no máximo 100 caracteres')
  .refine(
    (id) => !['search', 'count'].includes(id.toLowerCase()),
    'Os IDs search e count são reservados para consultas',
  );

export const createPokemonSchema = z
  // Na criação, omitir trainerId deixa o Pokémon sem squad; o nível padrão é 1.
  .object({
    id: pokemonIdSchema.optional(),
    name: z
      .string({ required_error: 'O nome é obrigatório' })
      .trim()
      .min(2, 'O nome deve ter no mínimo 2 caracteres')
      .max(150, 'O nome deve ter no máximo 150 caracteres'),
    type: pokemonTypeSchema.optional(),
    hp: z.number().int().min(0).optional(),
    level: z.number().int().min(1).max(100).optional().default(1),
    trainerId: z
      .string()
      .uuid('O trainerId deve ser um UUID válido')
      .optional(),
  })
  .strict('O payload contém campos não permitidos');

export const updatePokemonSchema = z
  .object({
    name: z.string().trim().min(2).max(150).optional(),
    type: pokemonTypeSchema.optional(),
    hp: z.number().int().min(0).optional(),
    level: z.number().int().min(1).max(100).optional(),
    trainerId: z
      .union([z.string().uuid('O trainerId deve ser um UUID válido'), z.null()])
      // Aqui null desfaz o vínculo; omitir o campo deixa o treinador como está.
      .optional(),
  })
  .strict('O payload contém campos não permitidos')
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Informe ao menos um campo para atualização',
  });

export const updatePokemonLevelSchema = z
  .object({ level: z.number().int().min(1).max(100) })
  .strict('O payload contém campos não permitidos');

export const pokemonIdParamsSchema = z.object({ id: pokemonIdSchema });

export const searchPokemonsQuerySchema = z.object({
  name: z.string().trim().min(1).max(150),
});

export const listPokemonsQuerySchema = z
  .object({
    page: z.coerce.number().int().min(1).optional().default(1),
    limit: z.coerce.number().int().min(1).max(50).optional().default(10),
    type: pokemonTypeSchema.optional(),
    minLevel: z.coerce.number().int().min(1).max(100).optional().default(1),
    maxLevel: z.coerce.number().int().min(1).max(100).optional().default(100),
  })
  .strict('A consulta contém parâmetros não permitidos')
  .refine((query) => query.minLevel <= query.maxLevel, {
    message: 'minLevel não pode ser maior que maxLevel',
    path: ['minLevel'],
  });

export type CreatePokemonInput = z.infer<typeof createPokemonSchema>;
export type ListPokemonsQuery = z.infer<typeof listPokemonsQuerySchema>;
