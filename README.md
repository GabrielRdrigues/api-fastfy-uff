# PokémonManager API

API REST para cadastrar Pokémon e treinadores, desenvolvida na disciplina de Tópicos Especiais em Engenharia de Software. O projeto cobre as aulas 7 a 12 e a **Etapa 2** do trabalho: Docker, PostgreSQL, Prisma, validação com Zod, integração resiliente com a PokéAPI, tratamento de erros e regras de equipe.

Tecnologias: Node.js 24, TypeScript, Express 5, PostgreSQL 16, Prisma 6, Zod, Axios, Docker Compose e Swagger.

Os imports internos usam os aliases `@domain`, `@application`, `@infrastructure` e `@main`, seguindo a organização do projeto de referência.

- [Como explicar a Etapa 2](docs/como-explicar-etapa-2.md)
- [Aulas 9, 10, 11 e 12](docs/aulas-9-12.md)
- [Aulas 7 e 8](docs/aulas-7-8.md)

## Executar com Docker

### 1. Configurar o ambiente

Na raiz do projeto, crie o `.env` a partir do exemplo:

```bash
cp .env.example .env
```

No PowerShell, o comando equivalente é:

```powershell
Copy-Item .env.example .env
```

Configuração usada pelo projeto:

| Variável            | Valor sugerido                                                                |
| ------------------- | ----------------------------------------------------------------------------- |
| `PORT`              | `3333`                                                                        |
| `NODE_ENV`          | `development`                                                                 |
| `POSTGRES_HOST`     | `localhost`                                                                   |
| `POSTGRES_PORT`     | `5433`                                                                        |
| `POSTGRES_USER`     | `manager-api`                                                                 |
| `POSTGRES_PASSWORD` | Sua senha local                                                               |
| `POSTGRES_DB`       | `pokemon-manager`                                                             |
| `USE_EXTERNAL_API`  | `true` para PokéAPI; `false` para o modo offline                              |
| `ADMINER_PORT`      | `8080`                                                                        |
| `PGADMIN_PORT`      | `5050`                                                                        |
| `PGADMIN_EMAIL`     | Login do pgAdmin Web                                                          |
| `PGADMIN_PASSWORD`  | Senha do pgAdmin Web                                                          |
| `DATABASE_URL`      | `postgresql://manager-api:SENHA@localhost:5433/pokemon-manager?schema=public` |

O PostgreSQL instalado diretamente no computador pode continuar em `localhost:5432`. O Compose publica o PostgreSQL do container em `localhost:5433` para evitar conflito. Dentro da rede do Docker, a API e o serviço de migração acessam `postgres:5432`.

### 2. Subir os serviços

```bash
docker compose up -d --build
docker compose ps
```

O fluxo de inicialização é:

1. `postgres` cria ou abre o banco no volume `postgres_data`;
2. `migrate` executa `prisma migrate deploy` e termina com código `0`;
3. `api` inicia depois que a migração termina com sucesso.

O serviço `migrate` aparecer como encerrado após concluir; esse é o comportamento esperado. As migrações versionadas em [prisma/migrations](prisma/migrations) recriam a estrutura das tabelas em qualquer computador. O volume preserva os registros naquele computador entre reinicializações.

Abra:

- API: <http://localhost:3333>
- Saúde da API e do banco: <http://localhost:3333/health>
- Swagger: <http://localhost:3333/api/docs>

Para acompanhar os logs:

```bash
docker compose logs -f api postgres migrate
```

### 3. Conectar pelo pgAdmin Desktop

No pgAdmin, use **Register > Server** e configure:

| Campo                | Valor                          |
| -------------------- | ------------------------------ |
| Host name/address    | `localhost`                    |
| Port                 | `5433`                         |
| Maintenance database | `pokemon-manager`              |
| Username             | `manager-api`                  |
| Password             | O valor de `POSTGRES_PASSWORD` |

O pgAdmin Desktop é somente um cliente e pode ser usado sem nenhum serviço gráfico no Compose.

Para demonstrar as duas interfaces usadas no material do professor, o profile opcional `tools` disponibiliza Adminer e pgAdmin Web:

```bash
docker compose --profile tools up -d
```

- **Adminer:** abra <http://localhost:8080>, selecione PostgreSQL e use servidor `postgres`, banco `pokemon-manager` e as credenciais `POSTGRES_*`.
- **pgAdmin Web:** abra <http://localhost:5050> e entre com `PGADMIN_EMAIL` e `PGADMIN_PASSWORD`. Depois registre um servidor com host `postgres`, porta `5432`, banco `pokemon-manager` e as credenciais `POSTGRES_*`.

As credenciais `PGADMIN_*` servem apenas para entrar na interface web. As credenciais `POSTGRES_*` são usadas para conectar ao banco.

### 4. Parar e preservar os dados

```bash
docker compose down
```

Esse comando preserva o volume. `docker compose down -v` também remove o volume e apaga os registros do banco Docker. Em outro computador, o Compose e as migrações recriam as tabelas, mas os registros só são transferidos por backup/restore ou por outro mecanismo de sincronização.

## Endpoints

Todos os caminhos abaixo começam com `/api/v1`.

| Método | Caminho                         | Comportamento                                              |
| ------ | ------------------------------- | ---------------------------------------------------------- |
| POST   | `/pokemons`                     | Cadastra por nome e enriquece com a PokéAPI; `201`         |
| GET    | `/pokemons`                     | Lista com `page`, `limit`, `type`, `minLevel` e `maxLevel` |
| GET    | `/pokemons/search?name=pika`    | Busca parcial por nome                                     |
| GET    | `/pokemons/count`               | Retorna o total cadastrado                                 |
| GET    | `/pokemons/:id`                 | Busca por ID                                               |
| PUT    | `/pokemons/:id`                 | Atualiza os campos enviados                                |
| PATCH  | `/pokemons/:id/level`           | Atualiza o nível; `204`                                    |
| DELETE | `/pokemons/:id`                 | Remove; `204`                                              |
| GET    | `/pokedex/search?name=pikachu`  | Consulta a PokéAPI sem persistir                           |
| POST   | `/trainers`                     | Cadastra treinador; `201`                                  |
| GET    | `/trainers`                     | Lista treinadores                                          |
| GET    | `/trainers/:id`                 | Busca por UUID                                             |
| PUT    | `/trainers/:id`                 | Atualiza o treinador                                       |
| DELETE | `/trainers/:id`                 | Libera a equipe e remove o treinador; `204`                |
| POST   | `/trainers/:trainerId/captures` | Busca na PokéAPI e captura um Pokémon                      |
| GET    | `/trainers/:trainerId/team`     | Lista a equipe do treinador                                |

O corpo e os parâmetros são validados com Zod. Dados inválidos retornam `400` com detalhes por campo, recursos ausentes retornam `404`, duplicidades e equipe já com seis Pokémon retornam `409`.

## Desenvolvimento local

Com Node.js 24 ou superior e PostgreSQL acessível pela `DATABASE_URL`:

```bash
npm ci
npm run db:migrate
npm run dev
```

| Comando                    | Finalidade                                          |
| -------------------------- | --------------------------------------------------- |
| `npm run dev`              | Inicia com recarga automática                       |
| `npm run build`            | Gera Prisma Client, Swagger e JavaScript compilado  |
| `npm start`                | Executa a versão compilada                          |
| `npm run prisma:generate`  | Gera o Prisma Client                                |
| `npm run db:migrate`       | Aplica migrações versionadas em ambiente executável |
| `npm run db:migrate:dev`   | Cria/aplica migrações durante desenvolvimento       |
| `npm run db:studio`        | Abre o Prisma Studio                                |
| `npm run lint`             | Verifica o TypeScript                               |
| `npm run test:integration` | Compila e testa a Etapa 2 com PostgreSQL real       |

Os testes criam um schema temporário, aplicam as migrações e exercitam validação, PokéAPI simulada, persistência, paginação, filtros, duplicidade, chave estrangeira, limite de seis capturas e remoção transacional. Ao terminar, removem somente o schema de teste.

## Estrutura

```text
prisma/                       Modelo e migrações versionadas
src/domain/                   Entidades, contratos e erros
src/application/              DTOs e casos de uso
src/infrastructure/database/  Prisma Client e repositórios
src/infrastructure/gateways/  PokéAPI via Axios e fallback em memória
src/infrastructure/http/      Controllers, schemas Zod, rotas e middleware
src/main/                     Configuração, factories e servidor
database/                     SQL histórico da aula 8
tests/                        Testes integrados da Etapa 2
```

Desenvolvido por Gabriel Rodrigues Marques Valim.
