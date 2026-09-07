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
  definitions: {
    Pokemon: {
      id: '1',
      name: 'Bulbasaur',
      type: 'Grass',
      hp: 45,
    },
    CreatePokemonDto: {
      id: '1',
      name: 'Bulbasaur',
      type: 'Grass',
      hp: 45,
    },
    ErrorResponse: {
      error: 'Pokémon não encontrado no catálogo.',
    },
  },
};

const outputFile = path.resolve(__dirname, 'swagger-output.json');

const endpointsFiles = [path.resolve(__dirname, '../../infrastructure/http/routes/pokemonRoutes.ts')];

swaggerAutogen({ openapi: '3.0.0' })(outputFile, endpointsFiles, doc);