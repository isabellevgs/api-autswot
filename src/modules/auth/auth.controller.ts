import type { FastifyRequest, FastifyReply } from 'fastify';
import { AuthService } from './auth.service.js';
import {
  registerSchema,
  loginSchema,
  updateProfileSchema,
  changePasswordSchema,
  refreshTokenSchema,
  type RegisterInput,
  type LoginInput,
  type UpdateProfileInput,
  type ChangePasswordInput,
  type RefreshTokenInput,
} from './auth.schemas.js';
import { env } from '../../config/env.js';

const authService = new AuthService();

export class AuthController {
  async register(request: FastifyRequest, reply: FastifyReply) {
    const data = registerSchema.parse(request.body) as RegisterInput;
    const user = await authService.register(data);

    // Garantir que o role esteja presente e seja uma string
    // Normalizar o role para garantir comparação correta no frontend
    const userRole = user.role ? String(user.role).toUpperCase() : 'USER';
    const userWithRole = {
      ...user,
      role: userRole,
    };

    // Gerar tokens JWT
    const accessToken = request.server.jwt.sign({
      id: userWithRole.id,
      email: userWithRole.email,
      name: userWithRole.name,
      role: userWithRole.role,
    }, {
      expiresIn: env.JWT_EXPIRES_IN
    });

    const refreshToken = request.server.jwt.sign({
      id: userWithRole.id,
    }, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN
    });

    return reply.status(201).send({
      message: 'Usuário criado com sucesso',
      user: userWithRole,
      accessToken,
      refreshToken,
    });
  }

  async login(request: FastifyRequest, reply: FastifyReply) {
    const data = loginSchema.parse(request.body) as LoginInput;
    const user = await authService.login(data);

    // Debug: log do role retornado
    console.log('🔍 [DEBUG API] login - Role retornado:', user.role, 'Tipo:', typeof user.role);
    console.log('🔍 [DEBUG API] login - Usuário completo:', JSON.stringify(user, null, 2));

    // Garantir que o role esteja presente e seja uma string
    // Normalizar o role para garantir comparação correta no frontend
    const userRole = user.role ? String(user.role).toUpperCase() : 'USER';
    const userWithRole = {
      ...user,
      role: userRole,
    };

    // Debug: verificar o userWithRole
    console.log('🔍 [DEBUG API] login - UserWithRole:', JSON.stringify(userWithRole, null, 2));

    // Gerar tokens JWT
    const accessToken = request.server.jwt.sign({
      id: userWithRole.id,
      email: userWithRole.email,
      name: userWithRole.name,
      role: userWithRole.role,
    }, {
      expiresIn: env.JWT_EXPIRES_IN
    });

    const refreshToken = request.server.jwt.sign({
      id: userWithRole.id,
    }, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN
    });

    const response = {
      message: 'Login realizado com sucesso',
      user: userWithRole,
      accessToken,
      refreshToken,
    };

    // Debug: verificar a resposta final
    console.log('🔍 [DEBUG API] login - Resposta final:', JSON.stringify(response, null, 2));

    return reply.send(response);
  }

  async refreshToken(request: FastifyRequest, reply: FastifyReply) {
    const data = refreshTokenSchema.parse(request.body) as RefreshTokenInput;

    try {
      // Verificar refresh token
      const decoded = request.server.jwt.verify<{ id: string }>(data.refreshToken);

      // Buscar dados atualizados do usuário
      const user = await authService.getProfile(decoded.id);

      // Garantir que o role esteja presente e seja uma string
      // Normalizar o role para garantir comparação correta no frontend
      const userRole = user.role ? String(user.role).toUpperCase() : 'USER';

      // Gerar novo access token
      const accessToken = request.server.jwt.sign({
        id: user.id,
        email: user.email,
        name: user.name,
        role: userRole,
      }, {
        expiresIn: env.JWT_EXPIRES_IN
      });

      return reply.send({
        message: 'Token renovado com sucesso',
        accessToken,
      });
    } catch (error) {
      return reply.status(401).send({
        error: 'Refresh token inválido ou expirado'
      });
    }
  }

  async getProfile(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user.id;
    const user = await authService.getProfile(userId);
    
    // Garantir que o role esteja presente e seja uma string
    // Normalizar o role para garantir comparação correta no frontend
    const userRole = user.role ? String(user.role).toUpperCase() : 'USER';
    const userWithRole = {
      ...user,
      role: userRole,
    };
    
    // Debug: log do role retornado
    console.log('🔍 [DEBUG API] getProfile - Role retornado:', userWithRole.role, 'Tipo:', typeof userWithRole.role);
    console.log('🔍 [DEBUG API] getProfile - Usuário completo:', JSON.stringify(userWithRole, null, 2));
    
    return reply.send({ user: userWithRole });
  }

  async updateProfile(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user.id;
    const data = updateProfileSchema.parse(request.body) as UpdateProfileInput;
    const user = await authService.updateProfile(userId, data);

    // Garantir que o role esteja presente e seja uma string
    // Normalizar o role para garantir comparação correta no frontend
    const userRole = user.role ? String(user.role).toUpperCase() : 'USER';
    const userWithRole = {
      ...user,
      role: userRole,
    };

    return reply.send({
      message: 'Perfil atualizado com sucesso',
      user: userWithRole
    });
  }

  async changePassword(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user.id;
    const data = changePasswordSchema.parse(request.body) as ChangePasswordInput;
    const result = await authService.changePassword(userId, data);

    return reply.send(result);
  }

  async deleteAccount(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user.id;
    const result = await authService.deleteAccount(userId);

    return reply.send(result);
  }
}

