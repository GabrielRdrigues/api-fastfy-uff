import { Request, Response } from 'express';
import { SearchPokedex } from '@application/use-cases/SearchPokedex';

export class PokedexController {
  constructor(private readonly searchPokedex: SearchPokedex) {}

  async search(_req: Request, res: Response): Promise<Response> {
    const { name } = res.locals.validated.query as { name: string };
    return res.status(200).json(await this.searchPokedex.execute(name));
  }
}
