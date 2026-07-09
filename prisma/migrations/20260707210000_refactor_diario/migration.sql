-- Drop legacy date-based diary
DROP TABLE IF EXISTS "DiaryAnswer";
DROP TABLE IF EXISTS "DiaryEntry";
DROP TABLE IF EXISTS "Question";

-- Diário da jornada SWOT
CREATE TABLE "DiarioPagina" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "quadrante" TEXT,
    "tipoTraco" TEXT,
    "numeroTraco" INTEGER,
    "tituloTraco" TEXT,
    "chave" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL,
    "texto" TEXT NOT NULL DEFAULT '',
    "concluida" BOOLEAN NOT NULL DEFAULT false,
    "desbloqueada" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiarioPagina_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "DiarioPagina_userId_chave_key" ON "DiarioPagina"("userId", "chave");
CREATE INDEX "DiarioPagina_userId_ordem_idx" ON "DiarioPagina"("userId", "ordem");

ALTER TABLE "DiarioPagina" ADD CONSTRAINT "DiarioPagina_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Diário de autoadvocacia
CREATE TABLE "DiarioAutoadvocaciaQuinzena" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "rotulo" TEXT,
    "inicio" TIMESTAMP(3) NOT NULL,
    "fim" TIMESTAMP(3) NOT NULL,
    "resposta1" TEXT NOT NULL DEFAULT '',
    "resposta2" TEXT NOT NULL DEFAULT '',
    "concluida" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DiarioAutoadvocaciaQuinzena_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "DiarioAutoadvocaciaQuinzena_userId_numero_key" ON "DiarioAutoadvocaciaQuinzena"("userId", "numero");
CREATE INDEX "DiarioAutoadvocaciaQuinzena_userId_idx" ON "DiarioAutoadvocaciaQuinzena"("userId");

ALTER TABLE "DiarioAutoadvocaciaQuinzena" ADD CONSTRAINT "DiarioAutoadvocaciaQuinzena_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
