import { AppError } from '@domain/errors/AppError';

// Validação antiga mantida como referência; as rotas atuais usam os schemas Zod.
export function validateTrainerId(id: string): void {
  if (
    !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)
  ) {
    throw new AppError('O ID do treinador deve ser um UUID válido.', 400);
  }
}

export function validateTrainerData(data: unknown, partial = false): void {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    throw new AppError('Envie um objeto com os dados do treinador.', 400);
  }

  const fields = data as Record<string, unknown>;
  const limits = { name: 150, email: 255, city: 100 };
  let providedFields = 0;

  for (const [field, maxLength] of Object.entries(limits)) {
    const value = fields[field];
    if (value === undefined && partial) continue;

    if (
      typeof value !== 'string' ||
      !value.trim() ||
      value.trim().length > maxLength
    ) {
      throw new AppError(
        `${field} deve ser um texto de 1 a ${maxLength} caracteres.`,
        400,
      );
    }

    if (field === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
      throw new AppError('Informe um e-mail válido.', 400);
    }
    providedFields += 1;
  }

  if (providedFields === 0) {
    throw new AppError('Informe ao menos um campo: name, email ou city.', 400);
  }
}
