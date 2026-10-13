CREATE TABLE "trainer_achievements" (
    "trainer_id" UUID NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "unlocked_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "trainer_achievements_pkey" PRIMARY KEY ("trainer_id", "code"),
    CONSTRAINT "trainer_achievements_trainer_id_fkey" FOREIGN KEY ("trainer_id")
        REFERENCES "trainers"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Reconhece as equipes existentes. A data registrada é a da migração,
-- pois não temos o histórico de quando cada condição foi atingida.
INSERT INTO "trainer_achievements" ("trainer_id", "code")
SELECT DISTINCT "trainer_id", 'FIRST_CAPTURE'
FROM "pokemons" WHERE "trainer_id" IS NOT NULL;

INSERT INTO "trainer_achievements" ("trainer_id", "code")
SELECT "trainer_id", 'FULL_TEAM'
FROM "pokemons" WHERE "trainer_id" IS NOT NULL
GROUP BY "trainer_id" HAVING COUNT(*) >= 6;

INSERT INTO "trainer_achievements" ("trainer_id", "code")
SELECT DISTINCT "trainer_id", 'LEVEL_10'
FROM "pokemons" WHERE "trainer_id" IS NOT NULL AND "level" >= 10;
