import { AppDataRepository } from './app-data.repository.js';

export class AppDataNotFoundError extends Error {
  constructor() {
    super('TCLE não cadastrado');
    this.name = 'AppDataNotFoundError';
  }
}

export class AppDataService {
  private repository = new AppDataRepository();

  async getTcle() {
    const appData = await this.repository.get();

    if (!appData) {
      throw new AppDataNotFoundError();
    }

    return { tcle: appData.tcle, updatedAt: appData.updatedAt };
  }

  async updateTcle(tcle: string) {
    const appData = await this.repository.updateTcle(tcle);
    return { tcle: appData.tcle };
  }
}
