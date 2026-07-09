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
import { issueTokenPair, normalizeRole } from './auth.tokens.js';
import { UnauthorizedError } from '../../utils/errors.js';

const authService = new AuthService();

export class AuthController {
  async register(request: FastifyRequest, reply: FastifyReply) {
    const data = registerSchema.parse(request.body) as RegisterInput;
    const user = await authService.register(data);

    const userWithRole = {
      ...user,
      role: normalizeRole(user.role),
      sessionVersion: 0,
    };

    const tokens = issueTokenPair(request.server, userWithRole);

    return reply.status(201).send({
      message: 'Usuário criado com sucesso',
      user: { id: userWithRole.id, email: userWithRole.email, name: userWithRole.name, role: userWithRole.role, createdAt: user.createdAt },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  }

  async login(request: FastifyRequest, reply: FastifyReply) {
    const data = loginSchema.parse(request.body) as LoginInput;
    const user = await authService.login(data);

    const userWithRole = {
      ...user,
      role: normalizeRole(user.role),
      sessionVersion: user.sessionVersion ?? 0,
    };

    const tokens = issueTokenPair(request.server, userWithRole);

    return reply.send({
      message: 'Login realizado com sucesso',
      user: { id: userWithRole.id, email: userWithRole.email, name: userWithRole.name, role: userWithRole.role, createdAt: user.createdAt },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  }

  async refreshToken(request: FastifyRequest, reply: FastifyReply) {
    const data = refreshTokenSchema.parse(request.body) as RefreshTokenInput;

    try {
      const decoded = request.server.jwt.refresh.verify<{ id: string; sv?: number }>(data.refreshToken);
      const tokenSv = decoded.sv ?? 0;

      const sessionUser = await authService.getSessionUser(decoded.id);
      if (sessionUser.sessionVersion !== tokenSv) {
        throw new UnauthorizedError('Refresh token inválido ou expirado');
      }

      const newSv = await authService.rotateSession(decoded.id);
      const tokens = issueTokenPair(request.server, { ...sessionUser, sessionVersion: newSv });

      return reply.send({
        message: 'Token renovado com sucesso',
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        throw error;
      }
      throw new UnauthorizedError('Refresh token inválido ou expirado');
    }
  }

  async getProfile(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user.id;
    const user = await authService.getProfile(userId);

    const userWithRole = {
      ...user,
      role: normalizeRole(user.role),
    };

    return reply.send({ user: userWithRole });
  }

  async updateProfile(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user.id;
    const data = updateProfileSchema.parse(request.body) as UpdateProfileInput;
    const user = await authService.updateProfile(userId, data);

    const sessionUser = await authService.getSessionUser(userId);
    const tokens = issueTokenPair(request.server, sessionUser);

    const userWithRole = {
      ...user,
      role: normalizeRole(user.role),
    };

    return reply.send({
      message: 'Perfil atualizado com sucesso',
      user: userWithRole,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  }

  async changePassword(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user.id;
    const data = changePasswordSchema.parse(request.body) as ChangePasswordInput;
    const result = await authService.changePassword(userId, data);

    const sessionUser = await authService.getSessionUser(userId);
    const tokens = issueTokenPair(request.server, sessionUser);

    return reply.send({
      ...result,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  }

  async deleteAccount(request: FastifyRequest, reply: FastifyReply) {
    const userId = request.user.id;
    const result = await authService.deleteAccount(userId);

    return reply.send(result);
  }
}
