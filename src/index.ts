import { buildServer } from './server.js';
import { env } from './config/env.js';

const start = async () => {
  try {
    const fastify = await buildServer();
    
    await fastify.listen({ 
      port: parseInt(env.PORT), 
      host: '0.0.0.0' 
    });
    
    const ts = new Date().toISOString();
    console.log(`[autswot-api deploy-check ${ts}] ========== API pronta ==========`);
    console.log(`[autswot-api deploy-check ${ts}] Hostname: ${process.env.HOSTNAME ?? 'unknown'}`);
    console.log(`[autswot-api deploy-check ${ts}] Escutando: 0.0.0.0:${env.PORT}`);
    console.log(`[autswot-api deploy-check ${ts}] Health: GET /health`);
    console.log(`[autswot-api deploy-check ${ts}] Ambiente: ${env.NODE_ENV}`);
    console.log(`[autswot-api deploy-check ${ts}] CORS origins: ${env.FRONTEND_URL}`);
    console.log('🚀 Servidor rodando na porta', env.PORT);
    console.log(`📍 Acesse: http://localhost:${env.PORT}`);
    console.log(`🌍 Ambiente: ${env.NODE_ENV}`);
  } catch (err) {
    console.error('❌ Erro ao iniciar servidor:', err);
    process.exit(1);
  }
};

start();

