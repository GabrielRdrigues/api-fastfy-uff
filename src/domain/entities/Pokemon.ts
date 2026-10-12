export interface Pokemon {
  id: string;
  pokeApiId: number | null;
  name: string;
  type: string;
  types: string[];
  hp: number;
  attack: number;
  defense: number;
  speed: number;
  baseExperience: number;
  height: number;
  weight: number;
  level: number;
  imageUrl: string | null;
  trainerId: string | null;
  createdAt: Date;
}
