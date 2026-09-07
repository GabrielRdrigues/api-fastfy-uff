import {IPokemon,PokemonType,Rarity} from './interface';

interface IPokemonBattleStats{
    name: string;
    attack: number;
    defense: number;
    hp: number;
}

function calculatePokemonDamage(attacker: IPokemonBattleStats, defender: IPokemonBattleStats) : string {
  const baseDamage = attacker.attack - defender.defense;
  const totalHpRemaining = defender.hp - baseDamage;
  return "HP restante: " + totalHpRemaining;
}

const pikachu: IPokemonBattleStats = { name: "Pikachu", attack: 55, defense: 40, hp: 35 };
const charmander: IPokemonBattleStats = { name: "Charmander", attack: 52, defense: 43, hp: 39 };

console.log(calculatePokemonDamage(pikachu, charmander));

const bulbasaur: IPokemon = { id: "001", name: "Bulbasaur", type: PokemonType.GRASS, hp: 45, rarity: Rarity.COMMON };

type SearchIdentifier = string | number;

function findPokemonInCatalog(identifier: SearchIdentifier): IPokemon | undefined {
  const catalog: IPokemon[] = [
    { id: "001", name: "Bulbasaur", type: PokemonType.GRASS, hp: 45, rarity: Rarity.COMMON },
    { id: "004", name: "Charmander", type: PokemonType.FIRE, hp: 39, rarity: Rarity.COMMON },
    { id: "007", name: "Squirtle", type: PokemonType.WATER, hp: 44, rarity: Rarity.COMMON },
    { id: "025", name: "Pikachu", type: PokemonType.ELECTRIC, hp: 35, rarity: Rarity.RARE },
    { id: "150", name: "Mewtwo", type: PokemonType.PSYCHIC, hp: 106, rarity: Rarity.LEGENDARY }
  ];

  return catalog.find(pokemon => pokemon.id === identifier || pokemon.name === identifier);
}