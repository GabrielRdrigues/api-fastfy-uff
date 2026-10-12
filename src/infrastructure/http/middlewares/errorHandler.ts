import { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { AppError } from '@domain/errors/AppError';
import { ValidationError } from '@domain/errors/ValidationError';
import { PrismaErrorMapper } from '@infrastructure/database/prisma/PrismaErrorMapper';

export const errorHandler: ErrorRequestHandler = (error, _req, res, next) => {
  // Uma resposta iniciada não pode receber outro JSON; delegue ao Express.
  if (res.headersSent) {
    next(error);
    return;
  }

  let operationalError: AppError | undefined;
  if (error instanceof AppError) {
    operationalError = error;
  } else if (error instanceof ZodError) {
    operationalError = new ValidationError(
      'Dados de entrada inválidos',
      error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      })),
    );
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    operationalError = PrismaErrorMapper.toAppError(error);
  } else if (error instanceof SyntaxError && 'body' in error) {
    operationalError = new ValidationError(
      'O corpo da requisição deve ser um JSON válido.',
    );
  }

  if (operationalError && operationalError.statusCode !== 500) {
    // 4xx são esperados. Uma falha externa 503 mantém mensagem pública segura,
    // mas sua causa é registrada no servidor, nunca no JSON da resposta.
    if (operationalError.statusCode >= 500) {
      console.error('Falha de infraestrutura:', error);
    }
    res.status(operationalError.statusCode).json({
      status: 'error',
      message: operationalError.message,
      ...(operationalError.statusCode < 500 && operationalError.details != null
        ? { details: operationalError.details }
        : {}),
    });
    return;
  }

  // Inclui erros Prisma não mapeados e AppError 500: log da causa original,
  // preservada também quando um repositório já tiver traduzido a exceção.
  console.error('Erro inesperado:', error);
  res.status(500).json({
    status: 'error',
    message: 'Erro interno do servidor.',
  });
};
