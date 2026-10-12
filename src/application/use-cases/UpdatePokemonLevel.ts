import { IPokemonRepository } from '@domain/repositories/IPokemonRepository';

export class UpdatePokemonLevel {
  constructor(private readonly pokemonRepository: IPokemonRepository) {}

  async execute(id: string, newLevel: number): Promise<void> {
    await this.pokemonRepository.updateLevel(id, newLevel);
  }
}
