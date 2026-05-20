import { describe, it, expect, beforeAll, afterAll } from 'bun:test';
import { buildServer } from '../../server';
import type { FastifyInstance } from 'fastify';
import { registerPayloadFixture } from '../fixtures/registerPayload';
import type { RegisterInput } from '../../modules/auth/auth.schemas';

describe('Auth Integration Tests', () => {
  let app: FastifyInstance;
  let authToken: string;
  let refreshToken: string;
  let testUser: RegisterInput;

  beforeAll(async () => {
    testUser = {
      ...registerPayloadFixture,
      email: `test-${Date.now()}@example.com`,
      name: 'Test User',
      password: 'password123',
    };
    app = await buildServer();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /v1/auth/register', () => {
    it('deve registrar um novo usuário', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/v1/auth/register',
        payload: testUser,
      });

      expect(response.statusCode).toBe(201);
      const body = response.json();
      expect(body.user).toBeDefined();
      expect(body.user.email).toBe(testUser.email);
      expect(body.accessToken).toBeDefined();
      expect(body.refreshToken).toBeDefined();

      authToken = body.accessToken;
      refreshToken = body.refreshToken;
    });

    it('deve retornar erro ao tentar registrar email duplicado', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/v1/auth/register',
        payload: testUser,
      });

      expect(response.statusCode).toBe(409);
      const body = response.json();
      expect(body.error).toBe('Email já está em uso');
    });

    it('deve retornar erro com dados inválidos', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/v1/auth/register',
        payload: {
          email: 'invalid-email',
          name: 'Te',
          password: '123',
        },
      });

      expect(response.statusCode).toBe(400);
    });
  });

  describe('POST /v1/auth/login', () => {
    it('deve fazer login com credenciais válidas', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/v1/auth/login',
        payload: {
          email: testUser.email,
          password: testUser.password,
        },
      });

      expect(response.statusCode).toBe(200);
      const body = response.json();
      expect(body.user).toBeDefined();
      expect(body.accessToken).toBeDefined();
      expect(body.refreshToken).toBeDefined();
    });

    it('deve retornar erro com credenciais inválidas', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/v1/auth/login',
        payload: {
          email: testUser.email,
          password: 'wrongpassword',
        },
      });

      expect(response.statusCode).toBe(401);
    });
  });

  describe('GET /v1/auth/me', () => {
    it('deve retornar dados do usuário autenticado', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/v1/auth/me',
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.statusCode).toBe(200);
      const body = response.json();
      expect(body.user.email).toBe(testUser.email);
    });

    it('deve retornar erro sem token', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/v1/auth/me',
      });

      expect(response.statusCode).toBe(401);
    });
  });

  describe('POST /v1/auth/refresh-token', () => {
    it('deve renovar access token', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/v1/auth/refresh-token',
        payload: {
          refreshToken,
        },
      });

      expect(response.statusCode).toBe(200);
      const body = response.json();
      expect(body.accessToken).toBeDefined();
    });

    it('deve retornar erro com refresh token inválido', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/v1/auth/refresh-token',
        payload: {
          refreshToken: 'invalid-token',
        },
      });

      expect(response.statusCode).toBe(401);
    });
  });

  describe('PUT /v1/auth/profile', () => {
    it('deve atualizar perfil do usuário', async () => {
      const response = await app.inject({
        method: 'PUT',
        url: '/v1/auth/profile',
        headers: {
          authorization: `Bearer ${authToken}`,
        },
        payload: {
          name: 'Updated Name',
        },
      });

      expect(response.statusCode).toBe(200);
      const body = response.json();
      expect(body.user.name).toBe('Updated Name');
    });
  });

  describe('PUT /v1/auth/change-password', () => {
    it('deve trocar senha do usuário', async () => {
      const response = await app.inject({
        method: 'PUT',
        url: '/v1/auth/change-password',
        headers: {
          authorization: `Bearer ${authToken}`,
        },
        payload: {
          currentPassword: testUser.password,
          newPassword: 'newpassword123',
        },
      });

      expect(response.statusCode).toBe(200);
      
      // Atualizar senha do testUser para próximos testes
      testUser.password = 'newpassword123';
    });
  });

  describe('DELETE /v1/auth/account', () => {
    it('deve excluir conta do usuário', async () => {
      const response = await app.inject({
        method: 'DELETE',
        url: '/v1/auth/account',
        headers: {
          authorization: `Bearer ${authToken}`,
        },
      });

      expect(response.statusCode).toBe(200);
      const body = response.json();
      expect(body.message).toBe('Conta excluída com sucesso');
    });
  });
});

