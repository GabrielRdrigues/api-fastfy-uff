import { ErrorRequestHandler } from 'express';
import { Prisma } from '@prisma/client';
import { AppError } from '@domain/errors/AppError';
import { PrismaErrorMapper } from '@infrastructure/database/prisma/PrismaErrorMapper';

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  // Erro previsto já tem mensagem e status para devolver a quem chamou.
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
      ...(error.details === undefined ? {} : { details: error.details }),
    });
    return;
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    // Traduz o código do banco para uma resposta legível, tipo e-mail duplicado.
    const mapped = PrismaErrorMapper.toAppError(error);
    res.status(mapped.statusCode).json({
      status: 'error',
      message: mapped.message,
    });
    return;
  }
  if (error instanceof SyntaxError && 'body' in error) {
    res.status(400).json({
      status: 'error',
      message: 'O corpo da requisição deve ser um JSON válido.',
    });
    return;
  }
  // Deu ruim fora do esperado: detalhes ficam no log, sem expor o erro interno.
  console.error('Erro inesperado:', error);
  res.status(500).json({
    status: 'error',
    message: 'Erro interno do servidor.',
  });
};
