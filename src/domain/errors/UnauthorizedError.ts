import { AppError } from './AppError';

export class UnauthorizedError extends AppError {
  constructor(message = 'Não autorizado.', details?: unknown) {
    super(message, 401, details);
  }
}
