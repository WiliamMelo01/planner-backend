-- CreateEnum
CREATE TYPE "prioridades" AS ENUM ('BAIXA', 'MEDIA', 'ALTA');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "senha" VARCHAR(100) NOT NULL,
    "nome" VARCHAR(255) NOT NULL,
    "data_criacao" DATE NOT NULL DEFAULT CURRENT_DATE,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tarefas" (
    "id" SERIAL NOT NULL,
    "titulo" VARCHAR(255) NOT NULL,
    "descricao" TEXT NOT NULL,
    "status" VARCHAR(50) NOT NULL DEFAULT 'TODO',
    "prioridade" "prioridades" NOT NULL DEFAULT 'BAIXA',
    "data_criacao" DATE NOT NULL DEFAULT CURRENT_DATE,
    "data_limite" TIMESTAMP(6) NOT NULL,
    "id_coluna" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,

    CONSTRAINT "tarefas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "colunas" (
    "id" SERIAL NOT NULL,
    "titulo" VARCHAR(255) NOT NULL,
    "posicao" INTEGER NOT NULL DEFAULT 0,
    "data_criacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id_usuario" INTEGER NOT NULL,

    CONSTRAINT "colunas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notificacoes_agendadas" (
    "id" SERIAL NOT NULL,
    "data_notificacao" TIMESTAMP(6),
    "id_tarefa" INTEGER NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "enviado" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "notificacoes_agendadas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "preferencias_notificacoes" (
    "id" SERIAL NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "minutos_antecedencia" INTEGER[] DEFAULT ARRAY[60]::INTEGER[],

    CONSTRAINT "preferencias_notificacoes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "preferencias_notificacoes_id_usuario_key" ON "preferencias_notificacoes"("id_usuario");

-- AddForeignKey
ALTER TABLE "tarefas" ADD CONSTRAINT "tarefas_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tarefas" ADD CONSTRAINT "tarefas_id_coluna_fkey" FOREIGN KEY ("id_coluna") REFERENCES "colunas"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "colunas" ADD CONSTRAINT "colunas_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notificacoes_agendadas" ADD CONSTRAINT "notificacoes_agendadas_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notificacoes_agendadas" ADD CONSTRAINT "notificacoes_agendadas_id_tarefa_fkey" FOREIGN KEY ("id_tarefa") REFERENCES "tarefas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "preferencias_notificacoes" ADD CONSTRAINT "preferencias_notificacoes_id_usuario_fkey" FOREIGN KEY ("id_usuario") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
