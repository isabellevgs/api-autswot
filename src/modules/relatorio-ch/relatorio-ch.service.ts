import { prisma } from '../../config/database.js';
import { NotFoundError } from '../../utils/errors.js';
import type { CreateRelatorioAmeacaInput, UpdateRelatorioAmeacaInput } from '../relatorio-ameaca/relatorio-ameaca.schemas.js';

export async function listarRelatoriosCh() {
  return prisma.relatorioCh.findMany({ orderBy: { numeroTraco: 'asc' } });
}

export async function obterRelatorioCh(numeroTraco: number) {
  const relatorio = await prisma.relatorioCh.findUnique({ where: { numeroTraco } });
  if (!relatorio) {
    throw new NotFoundError(`Relatório CH não encontrado para traço ${numeroTraco}`);
  }
  return relatorio;
}

export async function criarRelatorioCh(data: CreateRelatorioAmeacaInput) {
  return prisma.relatorioCh.create({ data });
}

export async function atualizarRelatorioCh(id: string, data: UpdateRelatorioAmeacaInput) {
  const exists = await prisma.relatorioCh.findUnique({ where: { id } });
  if (!exists) throw new NotFoundError('Relatório CH não encontrado');
  return prisma.relatorioCh.update({ where: { id }, data });
}

export async function deletarRelatorioCh(id: string) {
  const exists = await prisma.relatorioCh.findUnique({ where: { id } });
  if (!exists) throw new NotFoundError('Relatório CH não encontrado');
  await prisma.relatorioCh.delete({ where: { id } });
  return { message: 'Relatório CH removido com sucesso' };
}
