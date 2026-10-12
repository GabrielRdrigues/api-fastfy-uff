import { Router } from 'express';
import { makeTrainerController } from '@main/factories/makeTrainerController.factory';
import { validateRequest } from '@infrastructure/http/middlewares/validateRequest';
import {
  capturePokemonSchema,
  createTrainerSchema,
  trainerCaptureParamsSchema,
  trainerIdParamsSchema,
  updateTrainerSchema,
} from '@infrastructure/http/schemas/trainerSchemas';

const trainerRouter = Router();
const trainerController = makeTrainerController();

trainerRouter.get('/', (req, res) => {
  /*
    #swagger.tags = ['Treinadores']
    #swagger.summary = 'Lista os treinadores cadastrados'
    #swagger.responses[200] = {
      description: 'Lista de treinadores.',
      content: { 'application/json': { schema: {
        type: 'array', items: { $ref: '#/components/schemas/Trainer' }
      } } }
    }
  */
  return trainerController.list(req, res);
});

trainerRouter.get(
  '/:trainerId/team',
  validateRequest({ params: trainerCaptureParamsSchema }),
  (req, res) => {
    /*
      #swagger.tags = ['Treinadores']
      #swagger.summary = 'Lista o time atual do treinador'
      #swagger.parameters['trainerId'] = { in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }
      #swagger.responses[200] = { description: 'Time atual, com até seis Pokémons.' }
      #swagger.responses[404] = { description: 'Treinador não encontrado.' }
    */
    return trainerController.team(req, res);
  },
);

trainerRouter.post(
  '/:trainerId/captures',
  validateRequest({
    params: trainerCaptureParamsSchema,
    body: capturePokemonSchema,
  }),
  (req, res) => {
    /*
      #swagger.tags = ['Treinadores']
      #swagger.summary = 'Captura um Pokémon consultando a PokéAPI'
      #swagger.parameters['trainerId'] = { in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }
      #swagger.requestBody = { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CapturePokemonDto' } } } }
      #swagger.responses[201] = { description: 'Pokémon capturado e associado ao treinador.' }
      #swagger.responses[404] = { description: 'Treinador ou Pokémon não encontrado.' }
      #swagger.responses[409] = { description: 'O treinador já possui seis Pokémons.' }
      #swagger.responses[503] = { description: 'PokéAPI temporariamente indisponível.' }
    */
    return trainerController.capture(req, res);
  },
);

trainerRouter.get(
  '/:id',
  validateRequest({ params: trainerIdParamsSchema }),
  (req, res) => {
    /*
    #swagger.tags = ['Treinadores']
    #swagger.summary = 'Busca um treinador pelo UUID'
    #swagger.parameters['id'] = {
      in: 'path', required: true, schema: { type: 'string', format: 'uuid' }
    }
    #swagger.responses[200] = {
      description: 'Treinador encontrado.',
      content: { 'application/json': { schema: { $ref: '#/components/schemas/Trainer' } } }
    }
    #swagger.responses[400] = { description: 'UUID inválido.' }
    #swagger.responses[404] = { description: 'Treinador não encontrado.' }
  */
    return trainerController.getById(req, res);
  },
);

trainerRouter.post(
  '/',
  validateRequest({ body: createTrainerSchema }),
  (req, res) => {
    /*
    #swagger.tags = ['Treinadores']
    #swagger.summary = 'Cadastra um treinador com e-mail único'
    #swagger.requestBody = {
      required: true,
      content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateTrainerDto' } } }
    }
    #swagger.responses[201] = {
      description: 'Treinador cadastrado.',
      content: { 'application/json': { schema: {
        type: 'object', properties: {
          message: { type: 'string' }, data: { $ref: '#/components/schemas/Trainer' }
        }
      } } }
    }
    #swagger.responses[400] = { description: 'Dados inválidos.' }
    #swagger.responses[409] = { description: 'E-mail já cadastrado.' }
  */
    return trainerController.create(req, res);
  },
);

trainerRouter.put(
  '/:id',
  validateRequest({ params: trainerIdParamsSchema, body: updateTrainerSchema }),
  (req, res) => {
    /*
    #swagger.tags = ['Treinadores']
    #swagger.summary = 'Atualiza um treinador preservando os campos omitidos'
    #swagger.parameters['id'] = {
      in: 'path', required: true, schema: { type: 'string', format: 'uuid' }
    }
    #swagger.requestBody = {
      required: true,
      content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateTrainerDto' } } }
    }
    #swagger.responses[200] = {
      description: 'Treinador atualizado.',
      content: { 'application/json': { schema: {
        type: 'object', properties: {
          message: { type: 'string' }, data: { $ref: '#/components/schemas/Trainer' }
        }
      } } }
    }
    #swagger.responses[400] = { description: 'UUID ou dados inválidos.' }
    #swagger.responses[404] = { description: 'Treinador não encontrado.' }
    #swagger.responses[409] = { description: 'E-mail já cadastrado.' }
  */
    return trainerController.update(req, res);
  },
);

trainerRouter.delete(
  '/:id',
  validateRequest({ params: trainerIdParamsSchema }),
  (req, res) => {
    /*
      #swagger.tags = ['Treinadores']
      #swagger.summary = 'Remove o treinador e deixa seus Pokémons selvagens'
      #swagger.responses[204] = { description: 'Treinador removido.' }
      #swagger.responses[404] = { description: 'Treinador não encontrado para exclusão' }
    */
    return trainerController.delete(req, res);
  },
);

export default trainerRouter;
