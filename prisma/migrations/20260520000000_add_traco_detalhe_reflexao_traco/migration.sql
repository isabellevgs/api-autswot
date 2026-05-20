-- CreateTable: TracoDetalhe
-- Conteúdo editorial de cada traço SWOT (textos explicativos, dicas, exemplos)
CREATE TABLE "TracoDetalhe" (
    "id"               TEXT NOT NULL,
    "tipo"             TEXT NOT NULL,
    "numeroTraco"      INTEGER NOT NULL,
    "titulo"           TEXT NOT NULL,
    "oQueE"            JSONB NOT NULL,
    "comoUsar"         JSONB NOT NULL,
    "comoOportunidade" JSONB NOT NULL,
    "comoAtrapalhar"   JSONB NOT NULL,
    "reduzirImpacto"   JSONB NOT NULL,
    "dicas"            JSONB NOT NULL,
    "exemplos"         JSONB NOT NULL,
    "createdAt"        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"        TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TracoDetalhe_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TracoDetalhe_tipo_numeroTraco_key" ON "TracoDetalhe"("tipo", "numeroTraco");
CREATE INDEX "TracoDetalhe_tipo_idx" ON "TracoDetalhe"("tipo");

-- CreateTable: ReflexaoTraco
-- Respostas qualitativas do usuário para cada traço do seu SWOT
CREATE TABLE "ReflexaoTraco" (
    "id"          TEXT NOT NULL,
    "userId"      TEXT NOT NULL,
    "tipo"        TEXT NOT NULL,
    "numeroTraco" INTEGER NOT NULL,
    "quadrante"   TEXT NOT NULL,
    "respostas"   JSONB NOT NULL,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"   TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReflexaoTraco_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReflexaoTraco_userId_tipo_numeroTraco_quadrante_key"
    ON "ReflexaoTraco"("userId", "tipo", "numeroTraco", "quadrante");
CREATE INDEX "ReflexaoTraco_userId_idx" ON "ReflexaoTraco"("userId");

-- AddForeignKey
ALTER TABLE "ReflexaoTraco"
    ADD CONSTRAINT "ReflexaoTraco_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id")
    ON DELETE CASCADE ON UPDATE CASCADE;
