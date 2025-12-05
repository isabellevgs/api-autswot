-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'SUPER_USER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Post" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "imageUrl" TEXT,
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Post_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL,
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiaryEntry" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiaryEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DiaryAnswer" (
    "id" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "texto" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiaryAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FraquezasAmeacasSh" (
    "id" TEXT NOT NULL,
    "numeroTraco" INTEGER NOT NULL,
    "pergunta" TEXT NOT NULL,
    "explicacao" TEXT NOT NULL,
    "frequencia" DOUBLE PRECISION NOT NULL,
    "intensidade" DOUBLE PRECISION NOT NULL,
    "swot" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "FraquezasAmeacasSh_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HistoriasSociais" (
    "id" TEXT NOT NULL,
    "numeroHistoria" INTEGER NOT NULL,
    "introducao" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "personagem" TEXT NOT NULL,
    "ambientacao" TEXT NOT NULL,
    "historia" TEXT NOT NULL,
    "questionamento" TEXT NOT NULL,
    "perguntaIntensidade" TEXT NOT NULL,
    "intensidadeLeve" TEXT NOT NULL,
    "intensidadeModerada" TEXT NOT NULL,
    "intensidadeAlta" TEXT NOT NULL,

    CONSTRAINT "HistoriasSociais_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FraquezasAmeacasCh" (
    "id" TEXT NOT NULL,
    "numeroTraco" INTEGER NOT NULL,
    "numHistoria" INTEGER NOT NULL,
    "frequencia" DOUBLE PRECISION NOT NULL,
    "intensidade" DOUBLE PRECISION NOT NULL,
    "swot" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "FraquezasAmeacasCh_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FraquezasOportunidades" (
    "id" TEXT NOT NULL,
    "numeroTraco" INTEGER NOT NULL,
    "pergunta" TEXT NOT NULL,
    "explicacao" TEXT NOT NULL,
    "swot" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "FraquezasOportunidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TracoNeutroFO" (
    "id" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "fraquezasOportunidadesId" TEXT NOT NULL,

    CONSTRAINT "TracoNeutroFO_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TracoOportunidadeFO" (
    "id" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "fraquezasOportunidadesId" TEXT NOT NULL,

    CONSTRAINT "TracoOportunidadeFO_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TracoFraquezaFO" (
    "id" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "fraquezasOportunidadesId" TEXT NOT NULL,

    CONSTRAINT "TracoFraquezaFO_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Forcas" (
    "id" TEXT NOT NULL,
    "numeroTraco" INTEGER NOT NULL,
    "pergunta" TEXT NOT NULL,
    "exemplo" TEXT NOT NULL,
    "swot" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Forcas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TracoNeutroF" (
    "id" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "forcasId" TEXT NOT NULL,

    CONSTRAINT "TracoNeutroF_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TracoForcaF" (
    "id" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "forcasId" TEXT NOT NULL,

    CONSTRAINT "TracoForcaF_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TracoFraquezaF" (
    "id" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "forcasId" TEXT NOT NULL,

    CONSTRAINT "TracoFraquezaF_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TracoOportunidadeF" (
    "id" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "forcasId" TEXT NOT NULL,

    CONSTRAINT "TracoOportunidadeF_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionarioResposta" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "perguntaId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "numeroTraco" INTEGER NOT NULL,
    "resposta" TEXT,
    "frequencia" INTEGER,
    "intensidade" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuestionarioResposta_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Post_authorId_idx" ON "Post"("authorId");

-- CreateIndex
CREATE INDEX "Post_createdAt_idx" ON "Post"("createdAt");

-- CreateIndex
CREATE INDEX "Question_userId_idx" ON "Question"("userId");

-- CreateIndex
CREATE INDEX "Question_userId_ordem_idx" ON "Question"("userId", "ordem");

-- CreateIndex
CREATE INDEX "Question_userId_ativo_idx" ON "Question"("userId", "ativo");

-- CreateIndex
CREATE INDEX "DiaryEntry_userId_idx" ON "DiaryEntry"("userId");

-- CreateIndex
CREATE INDEX "DiaryEntry_userId_date_idx" ON "DiaryEntry"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "DiaryEntry_userId_date_key" ON "DiaryEntry"("userId", "date");

-- CreateIndex
CREATE INDEX "DiaryAnswer_entryId_idx" ON "DiaryAnswer"("entryId");

-- CreateIndex
CREATE INDEX "DiaryAnswer_questionId_idx" ON "DiaryAnswer"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "DiaryAnswer_entryId_questionId_key" ON "DiaryAnswer"("entryId", "questionId");

-- CreateIndex
CREATE INDEX "FraquezasAmeacasSh_numeroTraco_idx" ON "FraquezasAmeacasSh"("numeroTraco");

-- CreateIndex
CREATE INDEX "HistoriasSociais_numeroHistoria_idx" ON "HistoriasSociais"("numeroHistoria");

-- CreateIndex
CREATE INDEX "FraquezasAmeacasCh_numeroTraco_idx" ON "FraquezasAmeacasCh"("numeroTraco");

-- CreateIndex
CREATE INDEX "FraquezasOportunidades_numeroTraco_idx" ON "FraquezasOportunidades"("numeroTraco");

-- CreateIndex
CREATE INDEX "TracoNeutroFO_fraquezasOportunidadesId_idx" ON "TracoNeutroFO"("fraquezasOportunidadesId");

-- CreateIndex
CREATE INDEX "TracoOportunidadeFO_fraquezasOportunidadesId_idx" ON "TracoOportunidadeFO"("fraquezasOportunidadesId");

-- CreateIndex
CREATE INDEX "TracoFraquezaFO_fraquezasOportunidadesId_idx" ON "TracoFraquezaFO"("fraquezasOportunidadesId");

-- CreateIndex
CREATE INDEX "Forcas_numeroTraco_idx" ON "Forcas"("numeroTraco");

-- CreateIndex
CREATE INDEX "TracoNeutroF_forcasId_idx" ON "TracoNeutroF"("forcasId");

-- CreateIndex
CREATE INDEX "TracoForcaF_forcasId_idx" ON "TracoForcaF"("forcasId");

-- CreateIndex
CREATE INDEX "TracoFraquezaF_forcasId_idx" ON "TracoFraquezaF"("forcasId");

-- CreateIndex
CREATE INDEX "TracoOportunidadeF_forcasId_idx" ON "TracoOportunidadeF"("forcasId");

-- CreateIndex
CREATE INDEX "QuestionarioResposta_userId_idx" ON "QuestionarioResposta"("userId");

-- CreateIndex
CREATE INDEX "QuestionarioResposta_userId_tipo_idx" ON "QuestionarioResposta"("userId", "tipo");

-- CreateIndex
CREATE INDEX "QuestionarioResposta_perguntaId_idx" ON "QuestionarioResposta"("perguntaId");

-- CreateIndex
CREATE UNIQUE INDEX "QuestionarioResposta_userId_perguntaId_tipo_key" ON "QuestionarioResposta"("userId", "perguntaId", "tipo");

-- AddForeignKey
ALTER TABLE "Post" ADD CONSTRAINT "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiaryEntry" ADD CONSTRAINT "DiaryEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiaryAnswer" ADD CONSTRAINT "DiaryAnswer_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "DiaryEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DiaryAnswer" ADD CONSTRAINT "DiaryAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TracoNeutroFO" ADD CONSTRAINT "TracoNeutroFO_fraquezasOportunidadesId_fkey" FOREIGN KEY ("fraquezasOportunidadesId") REFERENCES "FraquezasOportunidades"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TracoOportunidadeFO" ADD CONSTRAINT "TracoOportunidadeFO_fraquezasOportunidadesId_fkey" FOREIGN KEY ("fraquezasOportunidadesId") REFERENCES "FraquezasOportunidades"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TracoFraquezaFO" ADD CONSTRAINT "TracoFraquezaFO_fraquezasOportunidadesId_fkey" FOREIGN KEY ("fraquezasOportunidadesId") REFERENCES "FraquezasOportunidades"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TracoNeutroF" ADD CONSTRAINT "TracoNeutroF_forcasId_fkey" FOREIGN KEY ("forcasId") REFERENCES "Forcas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TracoForcaF" ADD CONSTRAINT "TracoForcaF_forcasId_fkey" FOREIGN KEY ("forcasId") REFERENCES "Forcas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TracoFraquezaF" ADD CONSTRAINT "TracoFraquezaF_forcasId_fkey" FOREIGN KEY ("forcasId") REFERENCES "Forcas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TracoOportunidadeF" ADD CONSTRAINT "TracoOportunidadeF_forcasId_fkey" FOREIGN KEY ("forcasId") REFERENCES "Forcas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionarioResposta" ADD CONSTRAINT "QuestionarioResposta_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
