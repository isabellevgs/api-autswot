import { describe, it, expect, beforeEach, mock } from 'bun:test';
import { AuthService } from '../../modules/auth/auth.service';
import { AuthRepository } from '../../modules/auth/auth.repository';
import { ConflictError, UnauthorizedError, NotFoundError } from '../../utils/errors';
import bcrypt from 'bcryptjs';

// Mock do AuthRepository
mock.module('../../modules/auth/auth.repository', () => ({
  AuthRepository: class {
    findByEmail = mock(() => null);
    findById = mock(() => null);
    findByIdSelect = mock(() => null);
    create = mock(() => null);
    createSelect = mock(() => null);
    update = mock(() => null);
    updateSelect = mock(() => null);
    delete = mock(() => null);
    emailExistsExcept = mock(() => false);
    count = mock(() => 0);
    findMany = mock(() => []);
  },
}));

describe('AuthService', () => {
  let authService: AuthService;
  let authRepository: AuthRepository;

  beforeEach(() => {
    authService = new AuthService();
    authRepository = (authService as any).authRepository;
  });

  describe('register', () => {
    it('deve registrar um novo usuário com sucesso', async () => {
      const mockUser = {
        id: '123',
        email: 'test@example.com',
        name: 'Test User',
        createdAt: new Date(),
      };

      (authRepository.findByEmail as any).mockResolvedValueOnce(null);
      (authRepository.createSelect as any).mockResolvedValueOnce(mockUser);

      const result = await authService.register({
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123',
      });

      expect(result).toEqual(mockUser);
    });

    it('deve lançar ConflictError se email já existir', async () => {
      (authRepository.findByEmail as any).mockResolvedValueOnce({
        id: '123',
        email: 'test@example.com',
      });

      await expect(
        authService.register({
          email: 'test@example.com',
          name: 'Test User',
          password: 'password123',
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

      (authRepository.findByEmail as any).mockResolvedValueOnce(mockUser);

      const result = await authService.login({
        email: 'test@example.com',
        password: 'password123',
      });

      expect(result.email).toBe('test@example.com');
      expect(result.id).toBe('123');
    });

    it('deve lançar UnauthorizedError com email inválido', async () => {
      (authRepository.findByEmail as any).mockResolvedValueOnce(null);

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

      (authRepository.findByEmail as any).mockResolvedValueOnce(mockUser);

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

      (authRepository.findByIdSelect as any).mockResolvedValueOnce(mockUser);

      const result = await authService.getProfile('123');

      expect(result).toEqual(mockUser);
    });

    it('deve lançar NotFoundError se usuário não existir', async () => {
      (authRepository.findByIdSelect as any).mockResolvedValueOnce(null);

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

      (authRepository.emailExistsExcept as any).mockResolvedValueOnce(false);
      (authRepository.updateSelect as any).mockResolvedValueOnce(mockUser);

      const result = await authService.updateProfile('123', {
        email: 'new@example.com',
        name: 'New Name',
      });

      expect(result).toEqual(mockUser);
    });

    it('deve lançar ConflictError se email já existir', async () => {
      (authRepository.emailExistsExcept as any).mockResolvedValueOnce(true);

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

      (authRepository.findById as any).mockResolvedValueOnce(mockUser);
      (authRepository.update as any).mockResolvedValueOnce({});

      const result = await authService.changePassword('123', {
        currentPassword: 'oldpassword',
        newPassword: 'newpassword',
      });

      expect(result.message).toBe('Senha alterada com sucesso');
    });

    it('deve lançar UnauthorizedError com senha atual incorreta', async () => {
      const hashedPassword = await bcrypt.hash('oldpassword', 10);
      const mockUser = {
        id: '123',
        password: hashedPassword,
      };

      (authRepository.findById as any).mockResolvedValueOnce(mockUser);

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
      (authRepository.delete as any).mockResolvedValueOnce({});

      const result = await authService.deleteAccount('123');

      expect(result.message).toBe('Conta excluída com sucesso');
    });
  });
});

