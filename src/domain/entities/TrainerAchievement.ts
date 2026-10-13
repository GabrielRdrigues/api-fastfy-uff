export interface TrainerAchievement {
  trainerId: string;
  code: string;
  unlockedAt: Date;
}

export const achievementDefinitions = [
  {
    code: 'FIRST_CAPTURE',
    name: 'Primeira captura',
    description: 'Tenha pelo menos um Pokémon na equipe.',
    target: 1,
  },
  {
    code: 'FULL_TEAM',
    name: 'Equipe completa',
    description: 'Tenha seis Pokémon na equipe.',
    target: 6,
  },
  {
    code: 'LEVEL_10',
    name: 'Treinador dedicado',
    description: 'Tenha um Pokémon no nível 10 ou superior.',
    target: 10,
  },
];

export function getAchievementProgress(
  code: string,
  team: { level: number }[],
): number {
  if (code === 'LEVEL_10') {
    let highestLevel = 0;
    for (const pokemon of team) {
      highestLevel = Math.max(highestLevel, pokemon.level);
    }
    return highestLevel;
  }
  return team.length;
}
