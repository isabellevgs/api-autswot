-- CreateTable
CREATE TABLE "RelatorioSh" (
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

    CONSTRAINT "RelatorioSh_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RelatorioSh_numeroTraco_key" ON "RelatorioSh"("numeroTraco");

-- CreateIndex
CREATE INDEX "RelatorioSh_numeroTraco_idx" ON "RelatorioSh"("numeroTraco");
