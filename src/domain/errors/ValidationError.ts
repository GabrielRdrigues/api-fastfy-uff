import { AppError } from './AppError';

export class ValidationError extends AppError {
  constructor(message = 'Dados de entrada inválidos', details?: unknown) {
    super(message, 400, details);
  }
}
