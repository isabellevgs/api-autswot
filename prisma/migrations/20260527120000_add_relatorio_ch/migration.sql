-- CreateTable
CREATE TABLE "RelatorioCh" (
    "id" TEXT NOT NULL,
    "numeroTraco" INTEGER NOT NULL,
    "titulo" TEXT NOT NULL,
    "oQueE" JSONB NOT NULL,
    "atrapalharAcademico" TEXT NOT NULL DEFAULT '',
    "atrapalharProfissional" TEXT NOT NULL DEFAULT '',
    "atrapalharFamiliar" TEXT NOT NULL DEFAULT '',
    "atrapalharAmigosColegas" TEXT NOT NULL DEFAULT '',
    "atrapalharParceiros" TEXT NOT NULL DEFAULT '',
    "reduzirImpacto" JSONB NOT NULL,
    "dicas" JSONB NOT NULL,
    "exemplos" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RelatorioCh_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RelatorioCh_numeroTraco_key" ON "RelatorioCh"("numeroTraco");

-- CreateIndex
CREATE INDEX "RelatorioCh_numeroTraco_idx" ON "RelatorioCh"("numeroTraco");
