import { Router } from 'express';
import { makePokemonController } from '../../../main/factories/makePokemonController.factory';

const pokemonRouter = Router();
const pokemonController = makePokemonController();

pokemonRouter.get('/', (req, res) => {
  /*
    #swagger.tags = ['Pokemons']
    #swagger.summary = 'Lista todos os Pokémons'
    #swagger.description = 'Endpoint para listar Pokémons cadastrados, com filtro opcional por tipo.'
    #swagger.parameters['type'] = {
      in: 'query',
      name: 'type',
      required: false,
      schema: { type: 'string', example: 'Electric' },
      description: 'Filtra os Pokémons pelo tipo.'
    }
    #swagger.responses[200] = {
      description: 'Lista de Pokémons retornada com sucesso.',
      content: {
        'application/json': {
          schema: {
            type: 'array',
            items: { $ref: '#/components/schemas/Pokemon' }
          }
        }
      }
    }
  */
  return pokemonController.list(req, res);
});

pokemonRouter.get('/:id', (req, res) => {
  /*
    #swagger.tags = ['Pokemons']
    #swagger.summary = 'Busca um Pokémon pelo ID'
    #swagger.description = 'Endpoint para consultar um Pokémon específico pelo seu ID.'
    #swagger.parameters['id'] = {
      in: 'path',
      name: 'id',
      required: true,
      schema: { type: 'string', example: '25' },
      description: 'ID do Pokémon.'
    }
    #swagger.responses[200] = {
      description: 'Pokémon encontrado com sucesso.',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/Pokemon' }
        }
      }
    }
    #swagger.responses[404] = {
      description: 'Pokémon não encontrado.',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/ErrorResponse' }
        }
      }
    }
  */
  return pokemonController.getById(req, res);
});

pokemonRouter.post('/', (req, res) => {
  /*
    #swagger.tags = ['Pokemons']
    #swagger.summary = 'Cadastra um novo Pokémon'
    #swagger.description = 'Endpoint para cadastrar um Pokémon no catálogo.'
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/CreatePokemonDto' }
        }
      }
    }
    #swagger.responses[201] = {
      description: 'Pokémon cadastrado com sucesso.',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: { type: 'string', example: 'Pokémon cadastrado com sucesso!' },
              data: { $ref: '#/components/schemas/Pokemon' }
            }
          }
        }
      }
    }
    #swagger.responses[400] = {
      description: 'Dados inválidos ou ID já existente.',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/ErrorResponse' }
        }
      }
    }
  */
  return pokemonController.create(req, res);
});

pokemonRouter.put('/:id', (req, res) => {
  /*
    #swagger.tags = ['Pokemons']
    #swagger.summary = 'Atualiza um Pokémon'
    #swagger.description = 'Endpoint para atualizar os dados de um Pokémon cadastrado.'
    #swagger.parameters['id'] = {
      in: 'path',
      name: 'id',
      required: true,
      schema: { type: 'string', example: '25' },
      description: 'ID do Pokémon.'
    }
    #swagger.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/UpdatePokemonDto' }
        }
      }
    }
    #swagger.responses[200] = {
      description: 'Pokémon atualizado com sucesso.',
      content: {
        'application/json': {
          schema: {
            type: 'object',
            properties: {
              message: { type: 'string', example: 'Pokémon atualizado com sucesso!' },
              data: { $ref: '#/components/schemas/Pokemon' }
            }
          }
        }
      }
    }
    #swagger.responses[404] = {
      description: 'Pokémon não encontrado.',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/ErrorResponse' }
        }
      }
    }
  */
  return pokemonController.update(req, res);
});

pokemonRouter.delete('/:id', (req, res) => {
  /*
    #swagger.tags = ['Pokemons']
    #swagger.summary = 'Remove um Pokémon'
    #swagger.description = 'Endpoint para remover um Pokémon do catálogo.'
    #swagger.parameters['id'] = {
      in: 'path',
      name: 'id',
      required: true,
      schema: { type: 'string', example: '25' },
      description: 'ID do Pokémon.'
    }
    #swagger.responses[204] = {
      description: 'Pokémon removido com sucesso. A resposta não possui conteúdo.'
    }
    #swagger.responses[404] = {
      description: 'Pokémon não encontrado.',
      content: {
        'application/json': {
          schema: { $ref: '#/components/schemas/ErrorResponse' }
        }
      }
    }
  */
  return pokemonController.delete(req, res);
});

export default pokemonRouter;
