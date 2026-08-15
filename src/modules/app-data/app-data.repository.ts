import { prisma } from '../../config/database.js';
import type { AppData } from '../../../generated/prisma/index.js';

export class AppDataRepository {
  async get(): Promise<AppData | null> {
    return prisma.appData.findUnique({ where: { id: 1 } });
  }

  async updateTcle(tcle: string): Promise<AppData> {
    return prisma.appData.update({
      where: { id: 1 },
      data: { tcle },
    });
  }
}
