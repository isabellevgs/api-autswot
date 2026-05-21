import type { FastifyRequest, FastifyReply } from 'fastify';
import { UserService } from './user.service.js';
import { z } from 'zod';
import {
  updateUserSchema,
  getUserParamsSchema,
  listUsersQuerySchema,
  type UpdateUserInput,
  type GetUserParams,
  type ListUsersQuery,
} from './user.schemas.js';

const resetPasswordBodySchema = z.object({
  password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres'),
});

const userService = new UserService();

export class UserController {
  async getUser(request: FastifyRequest<{ Params: GetUserParams }>, reply: FastifyReply) {
    const { id } = getUserParamsSchema.parse(request.params);
    const user = await userService.getUserById(id);
    return reply.send({ user });
  }

  async listUsers(request: FastifyRequest<{ Querystring: ListUsersQuery }>, reply: FastifyReply) {
    const { page = 1, limit = 10 } = listUsersQuerySchema.parse(request.query);
    const result = await userService.listUsers(page, limit);
    return reply.send(result);
  }

  async updateUser(
    request: FastifyRequest<{ Params: GetUserParams; Body: UpdateUserInput }>,
    reply: FastifyReply
  ) {
    const { id } = getUserParamsSchema.parse(request.params);
    const data = updateUserSchema.parse(request.body) as UpdateUserInput;
    const user = await userService.updateUser(id, data);

    return reply.send({
      message: 'Usuário atualizado com sucesso',
      user,
    });
  }

  async deleteUser(request: FastifyRequest<{ Params: GetUserParams }>, reply: FastifyReply) {
    const { id } = getUserParamsSchema.parse(request.params);
    const requesterId = (request.user as { id: string }).id;
    const result = await userService.deleteUser(id, requesterId);
    return reply.send(result);
  }

  async resetPassword(
    request: FastifyRequest<{ Params: GetUserParams; Body: { password: string } }>,
    reply: FastifyReply,
  ) {
    const { id } = getUserParamsSchema.parse(request.params);
    const { password } = resetPasswordBodySchema.parse(request.body);
    const result = await userService.resetPassword(id, password);
    return reply.send(result);
  }
}

