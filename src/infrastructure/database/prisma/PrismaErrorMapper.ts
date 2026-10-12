import { Prisma } from '@prisma/client';
import { AppError } from '@domain/errors/AppError';
import { ValidationError } from '@domain/errors/ValidationError';
import { ConflictError } from '@domain/errors/ConflictError';
import { NotFoundError } from '@domain/errors/NotFoundError';

export class PrismaErrorMapper {
  static toAppError(
    error: Prisma.PrismaClientKnownRequestError,
    notFoundMessage?: string,
  ): AppError {
    switch (error.code) {
      case 'P2002': {
        const target = Array.isArray(error.meta?.target)
          ? error.meta.target
              .filter((field) => ['id', 'email'].includes(String(field)))
              .join(', ') || 'campo único'
          : 'campo único';
        return new ConflictError(
          `Já existe um registro cadastrado com este ${target}.`,
        );
      }
      case 'P2003':
        return new ValidationError(
          'Relacionamento inválido. O recurso associado não existe.',
        );
      case 'P2025':
        if (notFoundMessage) return new AppError(notFoundMessage, 404);
        return new NotFoundError('Registro no banco de dados');
      default:
        return new AppError('Erro interno do servidor.', 500, undefined, {
          cause: error,
        });
    }
  }
}
