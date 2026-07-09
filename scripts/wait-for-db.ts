import pg from "pg";

const MAX_ATTEMPTS = 30;
const DELAY_MS = 2000;

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("❌ DATABASE_URL não definida");
  process.exit(1);
}

const hostMatch = databaseUrl.match(/@([^:/]+)/);
const host = hostMatch?.[1] ?? "unknown";

console.log(`⏳ Aguardando PostgreSQL em ${host}...`);

for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
  const client = new pg.Client({ connectionString: databaseUrl });

  try {
    await client.connect();
    await client.query("SELECT 1");
    await client.end();
    console.log(`✅ PostgreSQL disponível (tentativa ${attempt}/${MAX_ATTEMPTS})`);
    process.exit(0);
  } catch {
    await client.end().catch(() => undefined);

    if (attempt === MAX_ATTEMPTS) {
      console.error(
        `❌ PostgreSQL indisponível após ${MAX_ATTEMPTS} tentativas (~${(MAX_ATTEMPTS * DELAY_MS) / 1000}s)`,
      );
      console.error(`   Host: ${host}`);
      console.error(
        "   Verifique: container postgres rodando, mesma rede Docker, alias autswot-postgres",
      );
      process.exit(1);
    }

    console.log(`   tentativa ${attempt}/${MAX_ATTEMPTS} — aguardando ${DELAY_MS / 1000}s...`);
    await Bun.sleep(DELAY_MS);
  }
}
