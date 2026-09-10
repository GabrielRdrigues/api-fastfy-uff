import path from 'path';
import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    version: '1.0.0',
    title: 'Pokemon API',
    description: 'API para gerenciamento de pokémons.',
  },
  host: 'localhost:3333',
  basePath: '/',
  schemes: ['http'],
  servers: [{ url: 'http://localhost:3333/api/v1/pokemons' }],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    {
      name: 'Pokemons',
      description: 'Endpoints de gerenciamento de pokémons',
    },
  ],
  components: {
    schemas: {
      Pokemon: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '1' },
          name: { type: 'string', example: 'Bulbasaur' },
          type: { type: 'string', example: 'Grass' },
          hp: { type: 'number', example: 45 },
        },
      },
      CreatePokemonDto: {
        type: 'object',
        required: ['id', 'name', 'type', 'hp'],
        properties: {
          id: { type: 'string', example: '1' },
          name: { type: 'string', example: 'Bulbasaur' },
          type: { type: 'string', example: 'Grass' },
          hp: { type: 'number', example: 45 },
        },
      },
      UpdatePokemonDto: {
        type: 'object',
        properties: {
          name: { type: 'string', example: 'Ivysaur' },
          type: { type: 'string', example: 'Grass' },
          hp: { type: 'number', example: 60 },
        },
      },
      ErrorResponse: {
        type: 'object',
        properties: {
          error: {
            type: 'string',
            example: 'Pokémon não encontrado no catálogo.',
          },
        },
      },
    },
  },
};

const outputFile = path.resolve(__dirname, 'swagger-output.json');

const endpointsFiles = [
  path.resolve(__dirname, '../../infrastructure/http/routes/pokemonRoutes.ts'),
];

swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc);
