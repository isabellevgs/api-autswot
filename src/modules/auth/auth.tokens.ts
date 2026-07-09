import type { FastifyInstance } from 'fastify';
import { env } from '../../config/env.js';

export function normalizeRole(role: string | undefined | null): string {
  return role ? String(role).toUpperCase() : 'USER';
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
  sessionVersion: number;
}

export function signAccessToken(server: FastifyInstance, user: SessionUser): string {
  return server.jwt.sign(
    {
      id: user.id,
      email: user.email,
      name: user.name,
      role: normalizeRole(user.role),
      sv: user.sessionVersion,
    },
    { expiresIn: env.JWT_EXPIRES_IN },
  );
}

export function signRefreshToken(server: FastifyInstance, userId: string, sessionVersion: number): string {
  return server.jwt.refresh.sign(
    { id: userId, sv: sessionVersion },
    { expiresIn: env.JWT_REFRESH_EXPIRES_IN },
  );
}

export function issueTokenPair(server: FastifyInstance, user: SessionUser) {
  return {
    accessToken: signAccessToken(server, user),
    refreshToken: signRefreshToken(server, user.id, user.sessionVersion),
  };
}
