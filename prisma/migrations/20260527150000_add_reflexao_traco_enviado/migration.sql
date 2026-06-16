-- AlterTable
ALTER TABLE "ReflexaoTraco" ADD COLUMN "enviado" BOOLEAN NOT NULL DEFAULT false;

-- Reflexões já existentes foram salvas com envio completo
UPDATE "ReflexaoTraco" SET "enviado" = true;
