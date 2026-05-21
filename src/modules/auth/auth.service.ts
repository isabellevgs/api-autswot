import bcrypt from 'bcryptjs';
import type { Prisma } from '../../../generated/prisma/index.js';
import { AuthRepository } from './auth.repository.js';
import { ConflictError, NotFoundError, UnauthorizedError } from '../../utils/errors.js';
import type { RegisterInput, LoginInput, UpdateProfileInput, ChangePasswordInput } from './auth.schemas.js';

/**
 * Service de Autenticação
 * Contém a lógica de negócio relacionada à autenticação
 */
export class AuthService {
  private authRepository: AuthRepository;

  constructor() {
    this.authRepository = new AuthRepository();
  }

  /**
   * Registrar novo usuário
   */
  async register(data: RegisterInput) {
    const { email, name, password, ...profileRegistration } = data;

    // Verificar se o email já está em uso
    const existingUser = await this.authRepository.findByEmail(email);

    if (existingUser) {
      throw new ConflictError('Email já está em uso');
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Criar usuário
    const user = await this.authRepository.createSelect(
      {
        email,
        name,
        password: hashedPassword,
        profileRegistration: profileRegistration as unknown as Prisma.InputJsonValue,
      },
      {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      }
    );

    return user;
  }

  /**
   * Login de usuário
   */
  async login(data: LoginInput) {
    // Buscar usuário por email com todos os campos necessários (incluindo password para verificação)
    const user = await this.authRepository.findByEmail(data.email);

    if (!user) {
      throw new UnauthorizedError('Email ou senha incorretos');
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Email ou senha incorretos');
    }

    // Debug: verificar o role antes de retornar
    console.log('🔍 [DEBUG SERVICE] login - Role do usuário no banco:', user.role, 'Tipo:', typeof user.role);
    console.log('🔍 [DEBUG SERVICE] login - Usuário completo do banco:', JSON.stringify(user, null, 2));

    // Garantir que o role seja uma string válida
    let userRole: string = 'USER'; // Default
    if (user.role) {
      // Converter enum para string explicitamente
      userRole = String(user.role).toUpperCase();
    }

    // Retornar dados do usuário (sem a senha)
    const userResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: userRole,
      createdAt: user.createdAt,
    };

    // Debug: verificar o role após montar a resposta
    console.log('🔍 [DEBUG SERVICE] login - Role na resposta:', userResponse.role, 'Tipo:', typeof userResponse.role);
    console.log('🔍 [DEBUG SERVICE] login - Resposta completa:', JSON.stringify(userResponse, null, 2));

    return userResponse;
  }

  /**
   * Obter perfil do usuário
   */
  async getProfile(userId: string) {
    const user = await this.authRepository.findByIdSelect(userId, {
      id: true,
      email: true,
      name: true,
      role: true,
      profileRegistration: true,
      createdAt: true,
      updatedAt: true,
    });

    if (!user) {
      throw new NotFoundError('Usuário não encontrado');
    }

    return user;
  }

  /**
   * Atualizar perfil do usuário
   */
  async updateProfile(userId: string, data: UpdateProfileInput) {
    // Se está mudando o email, verificar se já não existe
    if (data.email) {
      const emailExists = await this.authRepository.emailExistsExcept(data.email, userId);

      if (emailExists) {
        throw new ConflictError('Email já está em uso');
      }
    }

    const updatedUser = await this.authRepository.updateSelect(
      userId,
      data,
      {
        id: true,
        email: true,
        name: true,
        role: true,
        updatedAt: true,
      }
    );

    return updatedUser;
  }

  /**
   * Trocar senha do usuário
   */
  async changePassword(userId: string, data: ChangePasswordInput) {
    // Buscar usuário
    const user = await this.authRepository.findById(userId);

    if (!user) {
      throw new NotFoundError('Usuário não encontrado');
    }

    // Verificar senha atual
    const isPasswordValid = await bcrypt.compare(data.currentPassword, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Senha atual incorreta');
    }

    // Hash da nova senha
    const hashedPassword = await bcrypt.hash(data.newPassword, 10);

    // Atualizar senha
    await this.authRepository.update(userId, { password: hashedPassword });

    return { message: 'Senha alterada com sucesso' };
  }

  /**
   * Excluir conta do usuário
   */
  async deleteAccount(userId: string) {
    await this.authRepository.delete(userId);

    return { message: 'Conta excluída com sucesso' };
  }
}

