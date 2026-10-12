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
    example: 'c01ead76-1b3a-4d3a-a627-5e27120ad1ec',
  },
  name: { type: 'string', minLength: 2, maxLength: 150, example: 'pikachu' },
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
  experience: { type: 'integer', minimum: 0, example: 25 },
  lastTrainedAt: { type: 'string', format: 'date-time', nullable: true },
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
    minLength: 3,
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
    minLength: 2,
    maxLength: 100,
    example: 'Pallet Town',
  },
};

const doc = {
  info: {
    version: '1.0.0',
    title: 'PokéManager API',
    description:
      'Para testar: 1) crie um treinador e copie data.id; 2) use esse UUID nas rotas de captura e equipe; 3) copie o data.id do Pokémon para consultar, editar ou treinar. O ID salvo no banco é diferente do número da espécie na PokéAPI. Ao repetir um cadastro de treinador, use outro e-mail. Na Pokédex, use o nome completo em inglês, como pikachu.',
  },
  servers: [{ url: '/', description: 'Servidor atual' }],
  tags: [
    {
      name: 'Pokémon',
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
      TrainingResult: {
        type: 'object',
        properties: {
          gainedExperience: {
            type: 'integer',
            example: 28,
            description:
              'Um quarto de baseExperience, arredondado para baixo, com mínimo de 1.',
          },
          leveledUp: { type: 'boolean', example: false },
          level: pokemonProperties.level,
          experience: pokemonProperties.experience,
          experienceToNextLevel: {
            type: 'integer',
            nullable: true,
            example: 75,
          },
          nextTrainingAt: {
            type: 'string',
            format: 'date-time',
            nullable: true,
          },
        },
      },
      CreatePokemonDto: {
        type: 'object',
        additionalProperties: false,
        example: { name: 'pikachu', level: 5 },
        required: ['name'],
        properties: {
          id: pokemonProperties.id,
          name: pokemonProperties.name,
          type: pokemonProperties.type,
          hp: pokemonProperties.hp,
          level: pokemonProperties.level,
          trainerId: {
            type: 'string',
            format: 'uuid',
            description:
              'Opcional. Copie data.id de um treinador existente; omita para cadastrar sem treinador.',
          },
        },
      },
      UpdatePokemonDto: {
        type: 'object',
        additionalProperties: false,
        example: { level: 10 },
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
        additionalProperties: false,
        example: { name: 'pikachu', level: 5 },
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
        additionalProperties: false,
        example: {
          name: 'Ash Ketchum',
          email: 'ash@example.com',
          city: 'Pallet Town',
        },
        required: ['name', 'email', 'city'],
        properties: trainerProperties,
      },
      UpdateTrainerDto: {
        type: 'object',
        additionalProperties: false,
        example: { city: 'Niterói' },
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
  parameters?: Array<{
    name: string;
    in: string;
    schema: unknown;
    description?: string;
  }>;
  requestBody?: {
    content: Record<string, { schema?: { $ref?: string }; example?: unknown }>;
  };
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
  // Zod usa req.body/req.query internamente: inferência automática interpreta
  // parseAsync(req...) como campos públicos. Declare entradas nos comentários.
  const generate = swaggerAutogen({
    openapi: '3.0.0',
    writeOutputFile: false,
    autoQuery: false,
    autoBody: false,
    autoHeaders: false,
  });
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
    '/api/v1/pokemons/{id}/train': ['post'],
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
        if (parameter.in === 'path') {
          const trainer = route.startsWith('/api/v1/trainers');
          parameter.schema = trainer
            ? { type: 'string', format: 'uuid' }
            : { type: 'string', minLength: 1, maxLength: 100 };
          parameter.description = trainer
            ? 'UUID do treinador cadastrado. Copie data.id de POST /trainers ou id de GET /trainers.'
            : 'ID do registro no banco, não o número da espécie na PokéAPI. Copie data.id do cadastro/captura ou data[].id da listagem.';
        } else if (parameter.in === 'query') {
          // O autogen interpreta schema inline como objeto de exemplo.
          // Preserve os tipos OpenAPI reais dos parâmetros declarados nas rotas.
          const querySchemas: Record<string, unknown> = {
            type: pokemonProperties.type,
            page: { type: 'integer', minimum: 1, default: 1, example: 1 },
            limit: {
              type: 'integer',
              minimum: 1,
              maximum: 50,
              default: 10,
              example: 10,
            },
            minLevel: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 1,
              example: 1,
            },
            maxLevel: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 100,
              example: 100,
            },
            name: {
              type: 'string',
              minLength: route.startsWith('/api/v1/pokedex') ? 2 : 1,
              maxLength: 150,
              example: route.startsWith('/api/v1/pokedex') ? 'pikachu' : 'pika',
            },
          };
          assert.ok(
            querySchemas[parameter.name],
            `Parâmetro inesperado: ${parameter.name}`,
          );
          parameter.schema = querySchemas[parameter.name];
        }
      }
      const media = operation.requestBody?.content['application/json'];
      const schemaName = media?.schema?.$ref?.split('/').pop();
      if (media && schemaName) {
        const schemas = doc.components.schemas as Record<
          string,
          { example?: unknown }
        >;
        if (schemas[schemaName]?.example)
          media.example = schemas[schemaName].example;
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

  assert.ok(
    !JSON.stringify(swaggerDocument).includes('parseAsync'),
    'Swagger expôs detalhes do middleware',
  );

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
