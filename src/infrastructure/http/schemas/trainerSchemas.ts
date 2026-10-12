import { z } from 'zod';

const trainerFields = {
  name: z
    .string({ required_error: 'O nome é obrigatório' })
    .trim()
    .min(3, 'O nome deve ter no mínimo 3 caracteres')
    .max(150, 'O nome deve ter no máximo 150 caracteres'),
  email: z
    .string({ required_error: 'O e-mail é obrigatório' })
    .trim()
    .email('Formato de e-mail inválido')
    .max(255)
    .toLowerCase(),
  city: z
    .string({ required_error: 'A cidade é obrigatória' })
    .trim()
    .min(2, 'A cidade deve ter no mínimo 2 caracteres')
    .max(100, 'A cidade deve ter no máximo 100 caracteres'),
};

export const createTrainerSchema = z
  .object(trainerFields)
  // strict rejeita tudo que nao for do schema
  .strict('O payload contém campos não permitidos');

export const updateTrainerSchema = z
  .object({
    name: trainerFields.name.optional(),
    email: trainerFields.email.optional(),
    city: trainerFields.city.optional(),
  })
  .strict('O payload contém campos não permitidos')
  .refine((data) => Object.keys(data).length > 0, {
    message: 'Informe ao menos um campo para atualização',
  });

export const trainerIdParamsSchema = z.object({
  id: z.string().uuid('O ID do treinador deve ser um UUID válido'),
});

export const trainerCaptureParamsSchema = z.object({
  trainerId: z.string().uuid('O ID do treinador deve ser um UUID válido'),
});

export const capturePokemonSchema = z
  .object({
    name: z.string().trim().min(2).max(150),
    level: z.number().int().min(1).max(100).optional().default(1),
  })
  .strict('O payload contém campos não permitidos');

export type CreateTrainerInput = z.infer<typeof createTrainerSchema>;
