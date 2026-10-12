import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';

interface RequestValidationSchemas {
  body?: ZodSchema;
  query?: ZodSchema;
  params?: ZodSchema;
}

export const validateRequest = (schemas: RequestValidationSchemas) => {
  // A portaria da API: só segue para o controller se os dados passarem no Zod.
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const validated: Record<string, unknown> = {};
      if (schemas.body) {
        req.body = await schemas.body.parseAsync(req.body);
        validated.body = req.body;
      }
      if (schemas.query) {
        validated.query = await schemas.query.parseAsync(req.query);
      }
      if (schemas.params) {
        validated.params = await schemas.params.parseAsync(req.params);
      }
      // Guarda os dados já tratados só nesta requisição, incluindo valores padrão.
      // O controller lê daqui; não precisa repetir a validação.
      res.locals.validated = validated;
      next();
    } catch (error) {
      next(error);
    }
  };
};
