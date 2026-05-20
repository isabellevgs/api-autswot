import bcrypt from 'bcryptjs';
import { UserRepository } from './user.repository.js';
import { NotFoundError, ConflictError } from '../../utils/errors.js';
import type { UpdateUserInput } from './user.schemas.js';

/**
 * Service de User
 * Contém a lógica de negócio relacionada a usuários
 */
export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  /**
   * Obter usuário por ID
   */
  async getUserById(id: string) {
    const user = await this.userRepository.findByIdSelect(id, {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    });

    if (!user) {
      throw new NotFoundError('Usuário não encontrado');
    }

    return user;
  }

  /**
   * Listar usuários com paginação
   */
  async listUsers(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.userRepository.findMany(skip, limit),
      this.userRepository.count(),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Atualizar usuário
   */
  async updateUser(id: string, data: UpdateUserInput) {
    // Verificar se usuário existe
    const existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      throw new NotFoundError('Usuário não encontrado');
    }

    // Se está mudando o email, verificar se já não existe
    if (data.email && data.email !== existingUser.email) {
      const emailExists = await this.userRepository.findByEmail(data.email);
      if (emailExists) {
        throw new ConflictError('Email já está em uso');
      }
    }

    const updatedUser = await this.userRepository.updateSelect(
      id,
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
   * Redefinir senha de um usuário (ação administrativa, sem exigir senha atual)
   */
  async resetPassword(id: string, newPassword: string) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new NotFoundError('Usuário não encontrado');

    const hashed = await bcrypt.hash(newPassword, 10);
    await this.userRepository.update(id, { password: hashed });
    return { message: 'Senha redefinida com sucesso' };
  }

  /**
   * Deletar usuário
   */
  async deleteUser(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError('Usuário não encontrado');
    }

    await this.userRepository.delete(id);
    return { message: 'Usuário excluído com sucesso' };
  }
}

