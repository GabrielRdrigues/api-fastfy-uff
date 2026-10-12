import {
  ExternalPokemonDetails,
  IPokeApiGateway,
} from '@domain/gateways/IPokeApiGateway';

const pokemons: ExternalPokemonDetails[] = [
  {
    id: 25,
    name: 'pikachu',
    spriteUrl:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
    baseExperience: 112,
    height: 4,
    weight: 60,
    types: ['ELECTRIC'],
    stats: { hp: 35, attack: 55, defense: 40, speed: 90 },
  },
  {
    id: 4,
    name: 'charmander',
    spriteUrl:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png',
    baseExperience: 62,
    height: 6,
    weight: 85,
    types: ['FIRE'],
    stats: { hp: 39, attack: 52, defense: 43, speed: 65 },
  },
  {
    id: 1,
    name: 'bulbasaur',
    spriteUrl:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
    baseExperience: 64,
    height: 7,
    weight: 69,
    types: ['GRASS', 'POISON'],
    stats: { hp: 45, attack: 49, defense: 49, speed: 45 },
  },
];

export class InMemoryPokemonGateway implements IPokeApiGateway {
  async findByName(name: string): Promise<ExternalPokemonDetails | null> {
    const normalizedName = name.trim().toLowerCase();
    return pokemons.find((pokemon) => pokemon.name === normalizedName) ?? null;
  }
}
