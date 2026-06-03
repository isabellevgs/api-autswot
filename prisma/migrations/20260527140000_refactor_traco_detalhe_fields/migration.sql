-- Refatora TracoDetalhe: campos estruturados por quadrante (FO/F) e bullets de transformação

-- Novos campos (Forças — como pode ser usado)
ALTER TABLE "TracoDetalhe" ADD COLUMN IF NOT EXISTS "comoUsarAcademico" TEXT NOT NULL DEFAULT '';
ALTER TABLE "TracoDetalhe" ADD COLUMN IF NOT EXISTS "comoUsarProfissional" TEXT NOT NULL DEFAULT '';
ALTER TABLE "TracoDetalhe" ADD COLUMN IF NOT EXISTS "comoUsarCotidiano" TEXT NOT NULL DEFAULT '';

-- Oportunidade FO — exemplos por âmbito
ALTER TABLE "TracoDetalhe" ADD COLUMN IF NOT EXISTS "exemplosOportunidadeAcademico" TEXT NOT NULL DEFAULT '';
ALTER TABLE "TracoDetalhe" ADD COLUMN IF NOT EXISTS "exemplosOportunidadeProfissional" TEXT NOT NULL DEFAULT '';
ALTER TABLE "TracoDetalhe" ADD COLUMN IF NOT EXISTS "exemplosOportunidadeFamiliar" TEXT NOT NULL DEFAULT '';
ALTER TABLE "TracoDetalhe" ADD COLUMN IF NOT EXISTS "exemplosOportunidadeAmigosColegas" TEXT NOT NULL DEFAULT '';
ALTER TABLE "TracoDetalhe" ADD COLUMN IF NOT EXISTS "exemplosOportunidadeParceiros" TEXT NOT NULL DEFAULT '';

-- Oportunidade F — exemplos práticos (estudo / trabalho / cotidiano)
ALTER TABLE "TracoDetalhe" ADD COLUMN IF NOT EXISTS "exemplosPraticosEstudo" TEXT NOT NULL DEFAULT '';
ALTER TABLE "TracoDetalhe" ADD COLUMN IF NOT EXISTS "exemplosPraticosTrabalho" TEXT NOT NULL DEFAULT '';
ALTER TABLE "TracoDetalhe" ADD COLUMN IF NOT EXISTS "exemplosPraticosCotidiano" TEXT NOT NULL DEFAULT '';

-- Fraqueza FO/F
ALTER TABLE "TracoDetalhe" ADD COLUMN IF NOT EXISTS "fraquezaOuAmeaca" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "TracoDetalhe" ADD COLUMN IF NOT EXISTS "atrapalharAcademico" TEXT NOT NULL DEFAULT '';
ALTER TABLE "TracoDetalhe" ADD COLUMN IF NOT EXISTS "atrapalharProfissional" TEXT NOT NULL DEFAULT '';
ALTER TABLE "TracoDetalhe" ADD COLUMN IF NOT EXISTS "atrapalharFamiliar" TEXT NOT NULL DEFAULT '';
ALTER TABLE "TracoDetalhe" ADD COLUMN IF NOT EXISTS "atrapalharAmigosColegas" TEXT NOT NULL DEFAULT '';
ALTER TABLE "TracoDetalhe" ADD COLUMN IF NOT EXISTS "atrapalharParceiros" TEXT NOT NULL DEFAULT '';

-- Fraqueza / Oportunidade F — bullets de transformação
ALTER TABLE "TracoDetalhe" ADD COLUMN IF NOT EXISTS "transformarEmForca" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "TracoDetalhe" ADD COLUMN IF NOT EXISTS "transformarEmOportunidade" JSONB NOT NULL DEFAULT '[]';

-- Remove colunas legadas (arrays JSON únicos)
ALTER TABLE "TracoDetalhe" DROP COLUMN IF EXISTS "comoUsar";
ALTER TABLE "TracoDetalhe" DROP COLUMN IF EXISTS "comoAtrapalhar";
