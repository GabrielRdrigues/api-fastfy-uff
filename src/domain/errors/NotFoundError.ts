import { AppError } from './AppError';

export class NotFoundError extends AppError {
  constructor(entity: string) {
    super(`${entity} não encontrado.`, 404);
  }
}
