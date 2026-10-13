import { Request, Response } from 'express';
import { GetTrainerAchievements } from '@application/use-cases/GetTrainerAchievements';
import { CreateTrainer } from '@application/use-cases/CreateTrainer';
import { CapturePokemon } from '@application/use-cases/CapturePokemon';
import { DeleteTrainer } from '@application/use-cases/DeleteTrainer';
import { GetTrainerById } from '@application/use-cases/GetTrainerById';
import { GetTrainerTeam } from '@application/use-cases/GetTrainerTeam';
import { ListTrainers } from '@application/use-cases/ListTrainers';
import { UpdateTrainer } from '@application/use-cases/UpdateTrainer';

// O controller organiza a resposta HTTP; a regra do squad fica no caso de uso.
export class TrainerController {
  constructor(
    private readonly createTrainer: CreateTrainer,
    private readonly listTrainers: ListTrainers,
    private readonly getTrainerById: GetTrainerById,
    private readonly updateTrainer: UpdateTrainer,
    private readonly capturePokemon: CapturePokemon,
    private readonly getTrainerTeam: GetTrainerTeam,
    private readonly deleteTrainer: DeleteTrainer,
    private readonly getTrainerAchievements: GetTrainerAchievements,
  ) {}

  async list(_req: Request, res: Response): Promise<Response> {
    return res.status(200).json(await this.listTrainers.execute());
  }

  async getById(_req: Request, res: Response): Promise<Response> {
    return res
      .status(200)
      .json(
        await this.getTrainerById.execute(this.params<{ id: string }>(res).id),
      );
  }

  async create(_req: Request, res: Response): Promise<Response> {
    const trainer = await this.createTrainer.execute(res.locals.validated.body);
    return res.status(201).json({
      message: 'Treinador cadastrado com sucesso!',
      data: trainer,
    });
  }

  async update(_req: Request, res: Response): Promise<Response> {
    const trainer = await this.updateTrainer.execute(
      this.params<{ id: string }>(res).id,
      res.locals.validated.body,
    );
    return res.status(200).json({
      message: 'Treinador atualizado com sucesso!',
      data: trainer,
    });
  }

  async capture(_req: Request, res: Response): Promise<Response> {
    const { trainerId } = this.params<{ trainerId: string }>(res);
    const { name, level } = res.locals.validated.body as {
      name: string;
      level: number;
    };
    const pokemon = await this.capturePokemon.execute(trainerId, name, level);
    return res.status(201).json({
      message: 'Pokémon capturado com sucesso!',
      data: pokemon,
    });
  }

  async team(_req: Request, res: Response): Promise<Response> {
    const { trainerId } = this.params<{ trainerId: string }>(res);
    return res.status(200).json(await this.getTrainerTeam.execute(trainerId));
  }

  async achievements(_req: Request, res: Response): Promise<Response> {
    const { trainerId } = this.params<{ trainerId: string }>(res);
    return res
      .status(200)
      .json(await this.getTrainerAchievements.execute(trainerId));
  }

  async delete(_req: Request, res: Response): Promise<Response> {
    await this.deleteTrainer.execute(this.params<{ id: string }>(res).id);
    return res.status(204).send();
  }

  private params<T>(res: Response): T {
    return res.locals.validated.params as T;
  }
}
