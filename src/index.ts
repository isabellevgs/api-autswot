import { buildServer } from './server.js';
import { env } from './config/env.js';

const start = async () => {
  try {
    const fastify = await buildServer();
    
    await fastify.listen({ 
      port: parseInt(env.PORT), 
      host: '0.0.0.0' 
    });
    
    console.log('🚀 Servidor rodando na porta', env.PORT);
    console.log(`📍 Acesse: http://localhost:${env.PORT}`);
    console.log(`🌍 Ambiente: ${env.NODE_ENV}`);
  } catch (err) {
    console.error('❌ Erro ao iniciar servidor:', err);
    process.exit(1);
  }
};

start();

