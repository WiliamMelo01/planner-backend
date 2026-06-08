# Planner Backend

API backend criada para dar suporte ao projeto Planner, uma aplicação de organização de tarefas com autenticação, quadros por colunas e base para notificações assíncronas.

O objetivo deste backend é centralizar as regras de negócio do Planner, gerenciar usuários, tarefas e colunas, além de estruturar os dados necessários para um fluxo de notificações baseado em AWS.

## Arquitetura de notificações

O projeto foi pensado para suportar notificações de tarefas por meio de uma arquitetura assíncrona na AWS. A API mantém tarefas, preferências e notificações agendadas no banco de dados, enquanto o fluxo serverless fica responsável por consultar notificações pendentes e processar o envio.

![Arquitetura AWS de notificações do Planner](docs/planner-aws-architecture.jpg)

Fluxo proposto:

- O usuário cria tarefas e define preferências de notificação.
- A API registra tarefas, preferências e notificações agendadas no PostgreSQL.
- O Amazon EventBridge executa um agendamento periódico.
- Uma função AWS Lambda busca notificações pendentes para envio.
- As notificações são enviadas para uma fila Amazon SQS.
- Um consumidor processa as mensagens, envia os alertas e atualiza o status das notificações.

## Funcionalidades

- Cadastro e login de usuários.
- Autenticação com JWT.
- Hash de senha com bcrypt.
- CRUD de usuários autenticados.
- CRUD de tarefas por usuário.
- Organização de tarefas em colunas.
- Movimentação de tarefas entre colunas.
- Modelagem de preferências de notificação.
- Modelagem de notificações agendadas.

## Tecnologias

- Node.js
- Express
- Prisma ORM
- PostgreSQL
- JWT
- bcrypt
- dotenv
- CORS
- AWS EventBridge
- AWS Lambda
- Amazon SQS

## Estrutura principal

```text
controllers/
  auth-controller.js
  user-controller.js
  task-controller.js
  column-controller.js
middlewares/
  check-auth.js
services/
  jwt-service.js
prisma/
  schema.prisma
main.js
```

## Endpoints

Base URL local:

```text
http://localhost:3000/api/v1
```

### Autenticação

```text
POST /auth/signin
POST /auth/login
```

### Usuários

```text
GET    /users
GET    /users/me
PUT    /users
DELETE /users
```

### Tarefas

```text
POST   /tasks
GET    /tasks
GET    /tasks/:id
PUT    /tasks/:id
PATCH  /tasks/:id/move
DELETE /tasks/:id
```

### Colunas

```text
POST   /columns
GET    /columns
PATCH  /columns/:id/title
PATCH  /columns/:id/position
DELETE /columns/:id
```

## Como executar

### Pré-requisitos

- Node.js
- PostgreSQL
- npm

### Instalação

```bash
npm install
```

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/planner"
JWT_SECRET="sua_chave_secreta"
PORT=3000
```

Execute as migrations do Prisma:

```bash
npx prisma migrate dev
```

Inicie o servidor em modo desenvolvimento:

```bash
npm run dev
```

Ou em modo produção:

```bash
npm start
```

## Modelo de dados

O schema Prisma contempla:

- `Usuario`: dados de acesso, tarefas, colunas e preferências.
- `Tarefa`: título, descrição, status, prioridade, data limite e vínculo com coluna.
- `Coluna`: organização visual das tarefas por usuário.
- `preferencias_notificacoes`: antecedência configurada para lembretes.
- `notificacoes_agendadas`: notificações pendentes ou já enviadas.

## Observação

Este repositório contém a API principal do Planner. A imagem de arquitetura documenta o fluxo planejado para a camada de notificações assíncronas com AWS.
