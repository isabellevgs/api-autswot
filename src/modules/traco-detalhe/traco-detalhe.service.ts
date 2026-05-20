import { prisma } from '../../config/database.js';
import { NotFoundError } from '../../utils/errors.js';
import type { CreateTracoDetalheInput, UpdateTracoDetalheInput } from './traco-detalhe.schemas.js';

export async function listarTracosDetalhe() {
  return prisma.tracoDetalhe.findMany({ orderBy: [{ tipo: 'asc' }, { numeroTraco: 'asc' }] });
}

export async function obterTracoDetalhe(tipo: string, numeroTraco: number) {
  const detalhe = await prisma.tracoDetalhe.findUnique({
    where: { tipo_numeroTraco: { tipo, numeroTraco } },
  });
  if (!detalhe) throw new NotFoundError(`TracoDetalhe não encontrado para tipo=${tipo} numeroTraco=${numeroTraco}`);
  return detalhe;
}

export async function criarTracoDetalhe(data: CreateTracoDetalheInput) {
  return prisma.tracoDetalhe.create({ data });
}

export async function atualizarTracoDetalhe(id: string, data: UpdateTracoDetalheInput) {
  const exists = await prisma.tracoDetalhe.findUnique({ where: { id } });
  if (!exists) throw new NotFoundError('TracoDetalhe não encontrado');
  return prisma.tracoDetalhe.update({ where: { id }, data });
}

export async function deletarTracoDetalhe(id: string) {
  const exists = await prisma.tracoDetalhe.findUnique({ where: { id } });
  if (!exists) throw new NotFoundError('TracoDetalhe não encontrado');
  await prisma.tracoDetalhe.delete({ where: { id } });
  return { message: 'TracoDetalhe removido com sucesso' };
}
