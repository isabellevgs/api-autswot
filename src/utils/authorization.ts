import { ForbiddenError } from './errors.js';

export function isSuperUser(role: string | undefined): boolean {
  return role?.toString().trim().toUpperCase() === 'SUPER_USER';
}

export function assertSuperUser(role: string | undefined, message = 'Acesso negado. Permissão insuficiente.'): void {
  if (!isSuperUser(role)) {
    throw new ForbiddenError(message);
  }
}

export function assertSuperUserOrOwner(
  requester: { id: string; role: string | undefined },
  resourceOwnerId: string,
  message = 'Você não tem permissão para acessar este recurso.',
): void {
  if (!isSuperUser(requester.role) && requester.id !== resourceOwnerId) {
    throw new ForbiddenError(message);
  }
}
