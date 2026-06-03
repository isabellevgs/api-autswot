import { prisma } from '../../config/database.js';
import { NotFoundError } from '../../utils/errors.js';
import type { CreateRelatorioShInput, UpdateRelatorioShInput } from './relatorio-sh.schemas.js';

export async function listarRelatoriosSh() {
  return prisma.relatorioSh.findMany({ orderBy: { numeroTraco: 'asc' } });
}

export async function obterRelatorioSh(numeroTraco: number) {
  const relatorio = await prisma.relatorioSh.findUnique({ where: { numeroTraco } });
  if (!relatorio) {
    throw new NotFoundError(`Relatório SH não encontrado para traço ${numeroTraco}`);
  }
  return relatorio;
}

export async function obterRelatorioShPorId(id: string) {
  const relatorio = await prisma.relatorioSh.findUnique({ where: { id } });
  if (!relatorio) throw new NotFoundError('Relatório SH não encontrado');
  return relatorio;
}

export async function criarRelatorioSh(data: CreateRelatorioShInput) {
  return prisma.relatorioSh.create({ data });
}

export async function atualizarRelatorioSh(id: string, data: UpdateRelatorioShInput) {
  const exists = await prisma.relatorioSh.findUnique({ where: { id } });
  if (!exists) throw new NotFoundError('Relatório SH não encontrado');
  return prisma.relatorioSh.update({ where: { id }, data });
}

export async function deletarRelatorioSh(id: string) {
  const exists = await prisma.relatorioSh.findUnique({ where: { id } });
  if (!exists) throw new NotFoundError('Relatório SH não encontrado');
  await prisma.relatorioSh.delete({ where: { id } });
  return { message: 'Relatório SH removido com sucesso' };
}
