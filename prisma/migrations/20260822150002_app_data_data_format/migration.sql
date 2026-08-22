ALTER TABLE "AppData"
  ALTER COLUMN "dataInicioAcesso" TYPE DATE
  USING "dataInicioAcesso"::date;

ALTER TABLE "AppData"
  ALTER COLUMN "dataFimAcesso" TYPE DATE
  USING "dataFimAcesso"::date;
