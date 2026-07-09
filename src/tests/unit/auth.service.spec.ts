import { describe, it, expect, beforeEach, mock } from 'bun:test';
import { AuthService } from '../../modules/auth/auth.service.js';
import { ConflictError, UnauthorizedError, NotFoundError, ValidationError } from '../../utils/errors.js';
import bcrypt from 'bcryptjs';
import { registerPayloadFixture } from '../fixtures/registerPayload.js';

function createMockAuthRepository() {
  return {
    findByEmail: mock(() => null),
    findById: mock(() => null),
    findByIdSelect: mock(() => null),
    create: mock(() => null),
    createSelect: mock(() => null),
    update: mock(() => null),
    updateSelect: mock(() => null),
    delete: mock(() => null),
    emailExistsExcept: mock(() => false),
    incrementSessionVersion: mock(() => 1),
    findMany: mock(() => []),
  };
}

describe('AuthService', () => {
  let authService: AuthService;
  let authRepository: ReturnType<typeof createMockAuthRepository>;

  beforeEach(() => {
    authService = new AuthService();
    authRepository = createMockAuthRepository();
    (authService as unknown as { authRepository: typeof authRepository }).authRepository = authRepository;
  });

  describe('register', () => {
    it('deve registrar um novo usuário com sucesso', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date(),
      };

      authRepository.findByEmail.mockResolvedValueOnce(null);
      authRepository.createSelect.mockResolvedValueOnce(mockUser);

      const result = await authService.register({
        ...registerPayloadFixture,
        email: 'test@example.com',
        name: 'Test User',
      });

      expect(result).toEqual(mockUser);
    });

    it('deve lançar ConflictError se email já existir', async () => {
      authRepository.findByEmail.mockResolvedValueOnce({
        id: '123',
        email: 'test@example.com',
      });

      await expect(
        authService.register({
          ...registerPayloadFixture,
          email: 'test@example.com',
          name: 'Test User',
        })
      ).rejects.toThrow(ConflictError);
    });
  });

  describe('login', () => {
    it('deve fazer login com credenciais válidas', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      authRepository.findByEmail.mockResolvedValueOnce(mockUser);
      authRepository.incrementSessionVersion.mockResolvedValueOnce(3);

      const result = await authService.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.email).toBe('test@example.com');
      expect(result.id).toBe('123');
      expect(result.sessionVersion).toBe(3);
      expect(authRepository.incrementSessionVersion).toHaveBeenCalledWith('123');
    });

    it('deve lançar UnauthorizedError com email inválido', async () => {
      authRepository.findByEmail.mockResolvedValueOnce(null);

      await expect(
        authService.login({
          email: 'wrong@example.com',
          password: 'password123',
        })
      ).rejects.toThrow(UnauthorizedError);
    });

    it('deve lançar UnauthorizedError com senha inválida', async () => {
      const hashedPassword = await bcrypt.hash('password123', 10);
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        password: hashedPassword,
      };

      authRepository.findByEmail.mockResolvedValueOnce(mockUser);

      await expect(
        authService.login({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
      ).rejects.toThrow(UnauthorizedError);
    });
  });

  describe('getProfile', () => {
    it('deve retornar perfil do usuário', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      authRepository.findByIdSelect.mockResolvedValueOnce(mockUser);

      const result = await authService.getProfile('123');

      expect(result).toEqual(mockUser);
    });

    it('deve lançar NotFoundError se usuário não existir', async () => {
      authRepository.findByIdSelect.mockResolvedValueOnce(null);

      await expect(authService.getProfile('123')).rejects.toThrow(NotFoundError);
    });
  });

  describe('updateProfile', () => {
    it('deve atualizar perfil com sucesso', async () => {
      const mockUser = {
        id: '123',
        email: 'new@example.com',
        name: 'New Name',
        updatedAt: new Date(),
      };

      authRepository.emailExistsExcept.mockResolvedValueOnce(false);
      authRepository.updateSelect.mockResolvedValueOnce(mockUser);

      const result = await authService.updateProfile('123', {
        email: 'new@example.com',
        name: 'New Name',
      });

      expect(result).toEqual(mockUser);
    });

    it('deve lançar ConflictError se email já existir', async () => {
      authRepository.emailExistsExcept.mockResolvedValueOnce(true);

      await expect(
        authService.updateProfile('123', {
          email: 'existing@example.com',
        })
      ).rejects.toThrow(ConflictError);
    });
  });

  describe('changePassword', () => {
    it('deve trocar senha com sucesso', async () => {
      const hashedPassword = await bcrypt.hash('oldpassword', 10);
      const mockUser = {
        id: '123',
        password: hashedPassword,
      };

      authRepository.findById.mockResolvedValueOnce(mockUser);
      authRepository.update.mockResolvedValueOnce({});
      authRepository.incrementSessionVersion.mockResolvedValueOnce(2);

      const result = await authService.changePassword('123', {
        currentPassword: 'oldpassword',
        newPassword: 'newpassword',
      });

      expect(result.message).toBe('Senha alterada com sucesso');
      expect(authRepository.incrementSessionVersion).toHaveBeenCalledWith('123');
    });

    it('deve rejeitar nova senha igual à atual', async () => {
      const hashedPassword = await bcrypt.hash('samepassword', 10);
      authRepository.findById.mockResolvedValueOnce({ id: '123', password: hashedPassword });

      await expect(
        authService.changePassword('123', {
          currentPassword: 'samepassword',
          newPassword: 'samepassword',
        })
      ).rejects.toThrow(ValidationError);
    });

    it('deve lançar UnauthorizedError com senha atual incorreta', async () => {
      const hashedPassword = await bcrypt.hash('oldpassword', 10);
      const mockUser = {
        id: '123',
        password: hashedPassword,
      };

      authRepository.findById.mockResolvedValueOnce(mockUser);

      await expect(
        authService.changePassword('123', {
          currentPassword: 'wrongpassword',
          newPassword: 'newpassword',
        })
      ).rejects.toThrow(UnauthorizedError);
    });
  });

  describe('deleteAccount', () => {
    it('deve excluir conta com sucesso', async () => {
      authRepository.delete.mockResolvedValueOnce({});

      const result = await authService.deleteAccount('123');

      expect(result.message).toBe('Conta excluída com sucesso');
    });
  });
});
