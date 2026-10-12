import fs from 'fs';
import path from 'path';
import swaggerAutogen from 'swagger-autogen';
import assert from 'node:assert/strict';

const pokemonProperties = {
  id: {
    type: 'string',
    minLength: 1,
    maxLength: 100,
    description:
      'Identificador textual. Os valores search e count são reservados, independentemente de maiúsculas ou minúsculas.',
    example: '25',
  },
  name: { type: 'string', minLength: 2, maxLength: 150, example: 'Pikachu' },
  type: {
    type: 'string',
    enum: ['FIRE', 'WATER', 'GRASS', 'ELECTRIC', 'POISON', 'FLYING'],
    example: 'ELECTRIC',
  },
  types: {
    type: 'array',
    items: { type: 'string' },
    example: ['ELECTRIC'],
  },
  hp: { type: 'integer', minimum: 0, maximum: 2147483647, example: 35 },
  attack: { type: 'integer', minimum: 0, example: 55 },
  defense: { type: 'integer', minimum: 0, example: 40 },
  speed: { type: 'integer', minimum: 0, example: 90 },
  baseExperience: { type: 'integer', minimum: 0, example: 112 },
  height: { type: 'integer', minimum: 0, example: 4 },
  weight: { type: 'integer', minimum: 0, example: 60 },
  level: { type: 'integer', minimum: 1, maximum: 100, default: 1, example: 1 },
  imageUrl: { type: 'string', format: 'uri', nullable: true },
  trainerId: { type: 'string', format: 'uuid', nullable: true },
};

const trainerProperties = {
  name: {
    type: 'string',
    minLength: 1,
    maxLength: 150,
    example: 'Ash Ketchum',
  },
  email: {
    type: 'string',
    format: 'email',
    maxLength: 255,
    example: 'ash@example.com',
  },
  city: {
    type: 'string',
    minLength: 1,
    maxLength: 100,
    example: 'Pallet Town',
  },
};

const doc = {
  info: {
    version: '1.0.0',
    title: 'PokéManager API',
    description:
      'API de Pokémon e treinadores com persistência em PostgreSQL. Os IDs de Pokémon são textos; os UUIDs de treinadores são gerados pelo servidor.',
  },
  servers: [{ url: '/', description: 'Servidor atual' }],
  tags: [
    {
      name: 'Pokemons',
      description: 'Cadastro, busca, contagem e nível de Pokémon.',
    },
    {
      name: 'Treinadores',
      description: 'Cadastro e consulta de treinadores com e-mail único.',
    },
    {
      name: 'Pokédex',
      description: 'Consulta de dados oficiais na PokéAPI.',
    },
  ],
  components: {
    schemas: {
      Pokemon: {
        type: 'object',
        required: [
          'id',
          'name',
          'type',
          'types',
          'hp',
          'attack',
          'defense',
          'speed',
          'baseExperience',
          'height',
          'weight',
          'level',
        ],
        properties: pokemonProperties,
      },
      CreatePokemonDto: {
        type: 'object',
        required: ['name'],
        properties: {
          id: pokemonProperties.id,
          name: pokemonProperties.name,
          type: pokemonProperties.type,
          hp: pokemonProperties.hp,
          level: pokemonProperties.level,
          trainerId: pokemonProperties.trainerId,
        },
      },
      UpdatePokemonDto: {
        type: 'object',
        minProperties: 1,
        description:
          'Informe ao menos um campo. Campos omitidos mantêm seu valor atual.',
        properties: {
          name: pokemonProperties.name,
          type: pokemonProperties.type,
          hp: pokemonProperties.hp,
          level: pokemonProperties.level,
          trainerId: pokemonProperties.trainerId,
        },
      },
      CapturePokemonDto: {
        type: 'object',
        required: ['name'],
        properties: {
          name: pokemonProperties.name,
          level: pokemonProperties.level,
        },
      },
      PokeApiPokemon: {
        type: 'object',
        required: [
          'id',
          'name',
          'baseExperience',
          'height',
          'weight',
          'types',
          'stats',
        ],
        properties: {
          id: { type: 'integer', example: 25 },
          name: pokemonProperties.name,
          imageUrl: pokemonProperties.imageUrl,
          baseExperience: pokemonProperties.baseExperience,
          height: pokemonProperties.height,
          weight: pokemonProperties.weight,
          types: pokemonProperties.types,
          stats: {
            type: 'object',
            properties: {
              hp: pokemonProperties.hp,
              attack: pokemonProperties.attack,
              defense: pokemonProperties.defense,
              speed: pokemonProperties.speed,
            },
          },
        },
      },
      Trainer: {
        type: 'object',
        required: ['id', 'name', 'email', 'city', 'createdAt'],
        properties: {
          id: {
            type: 'string',
            format: 'uuid',
            example: '550e8400-e29b-41d4-a716-446655440000',
          },
          ...trainerProperties,
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2026-10-11T12:00:00.000Z',
          },
        },
      },
      CreateTrainerDto: {
        type: 'object',
        required: ['name', 'email', 'city'],
        properties: trainerProperties,
      },
      UpdateTrainerDto: {
        type: 'object',
        minProperties: 1,
        description:
          'Informe ao menos um campo. Campos omitidos mantêm seu valor atual.',
        properties: trainerProperties,
      },
      ErrorResponse: {
        type: 'object',
        required: ['status', 'message'],
        properties: {
          status: { type: 'string', example: 'error' },
          message: {
            type: 'string',
            example: 'Pokémon não encontrado no catálogo.',
          },
          details: { type: 'array', items: { type: 'object' } },
        },
      },
    },
  },
};

interface DocumentOperation {
  parameters?: Array<{ name: string; in: string; schema: unknown }>;
  responses: Record<string, { description: string; content?: unknown }>;
}

interface GeneratedDocument {
  paths: Record<string, Record<string, DocumentOperation>>;
  [key: string]: unknown;
}

async function generateSwagger(): Promise<void> {
  const outputFile = path.resolve(__dirname, 'swagger-output.json');
  // Mesmos prefixos de app.ts. A leitura estática dos routers não conecta ao banco.
  const resources = [
    { prefix: '/api/v1/pokemons', file: 'pokemonRoutes.ts' },
    { prefix: '/api/v1/trainers', file: 'trainerRoutes.ts' },
    { prefix: '/api/v1/pokedex', file: 'pokedexRoutes.ts' },
  ];
  const swaggerDocument: GeneratedDocument = {
    openapi: '3.0.0',
    ...doc,
    paths: {},
  };
  const generate = swaggerAutogen({ openapi: '3.0.0', writeOutputFile: false });
  for (const resource of resources) {
    const file = path.resolve(
      __dirname,
      '../../infrastructure/http/routes',
      resource.file,
    );
    // O autogen infere e altera os schemas recebidos; preserve os schemas OpenAPI explícitos.
    const result = await generate(outputFile, [file], structuredClone(doc));
    if (!result || !result.success) {
      throw new Error(`Não foi possível documentar ${resource.file}.`);
    }
    const resourcePaths = result.data.paths as GeneratedDocument['paths'];
    for (const [route, operations] of Object.entries(resourcePaths)) {
      const fullPath = `${resource.prefix}${route === '/' ? '' : route}`;
      swaggerDocument.paths[fullPath] = operations;
    }
  }

  const paths = swaggerDocument.paths;
  const requiredRoutes: Record<string, string[]> = {
    '/api/v1/pokemons': ['get', 'post'],
    '/api/v1/pokemons/search': ['get'],
    '/api/v1/pokemons/count': ['get'],
    '/api/v1/pokemons/{id}': ['get', 'put', 'delete'],
    '/api/v1/pokemons/{id}/level': ['patch'],
    '/api/v1/trainers': ['get', 'post'],
    '/api/v1/trainers/{id}': ['get', 'put', 'delete'],
    '/api/v1/trainers/{trainerId}/captures': ['post'],
    '/api/v1/trainers/{trainerId}/team': ['get'],
    '/api/v1/pokedex/search': ['get'],
  };
  for (const [route, methods] of Object.entries(requiredRoutes)) {
    for (const method of methods) {
      assert.ok(
        paths[route]?.[method],
        `Swagger incompleto: ${method.toUpperCase()} ${route}.`,
      );
    }
  }

  for (const [route, operations] of Object.entries(paths)) {
    for (const [method, operation] of Object.entries(operations)) {
      for (const parameter of operation.parameters ?? []) {
        if (parameter.name === 'id' && parameter.in === 'path') {
          parameter.schema = route.startsWith('/api/v1/trainers')
            ? doc.components.schemas.Trainer.properties.id
            : pokemonProperties.id;
        } else if (parameter.name === 'trainerId' && parameter.in === 'path') {
          parameter.schema = doc.components.schemas.Trainer.properties.id;
        } else if (parameter.name === 'type' && parameter.in === 'query') {
          parameter.schema = pokemonProperties.type;
        } else if (parameter.name === 'name' && parameter.in === 'query') {
          parameter.schema = { ...pokemonProperties.name, example: 'pika' };
        }
      }
      const acceptsInput =
        route.includes('{id}') ||
        route.endsWith('/search') ||
        (route.replace(/\/$/, '') === '/api/v1/pokemons' && method === 'get') ||
        method === 'post' ||
        method === 'put' ||
        method === 'patch';
      if (acceptsInput && !operation.responses['400']) {
        operation.responses['400'] = { description: 'Dados inválidos.' };
      }
      for (const code of ['400', '404', '409', '503']) {
        if (operation.responses[code]) {
          operation.responses[code].content = {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          };
        }
      }
    }
  }

  fs.writeFileSync(
    outputFile,
    `${JSON.stringify(swaggerDocument, null, 2)}\n`,
    'utf8',
  );
}

generateSwagger().catch((error: unknown) => {
  console.error(error);
  process.exitCode = 1;
});
