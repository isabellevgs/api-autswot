import { AppDataRepository } from './app-data.repository.js';

export class AppDataNotFoundError extends Error {
  constructor() {
    super('TCLE não cadastrado');
    this.name = 'AppDataNotFoundError';
  }
}

export interface AtualizarBloqueioAcessoInput {
  bloquearAcesso: boolean;
  dataInicioAcesso: string | null;
  dataFimAcesso: string | null;
  emailsComAcesso: string[];
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

  async getTermoUso() {
    const appData = await this.repository.get();
    if (!appData) {
      throw new AppDataNotFoundError();
    }
    return { termoUso: appData.termoUso, updatedAt: appData.updatedAt };
  }

  async updateTermoUso(termoUso: string) {
    const appData = await this.repository.updateTermoUso(termoUso);
    return { termoUso: appData.termoUso };
  }

  /** Uso administrativo: retorna a configuração completa (SUPER_USER). */
  async getBloqueioAcesso() {
    const appData = await this.repository.get();
    if (!appData) {
      throw new AppDataNotFoundError();
    }
    return {
      bloquearAcesso: appData.bloquearAcesso,
      dataInicioAcesso: appData.dataInicioAcesso,
      dataFimAcesso: appData.dataFimAcesso,
      emailsComAcesso: appData.emailsComAcesso,
    };
  }

  /** Uso pelo usuário comum: só diz se ELE está liberado, sem expor a lista/datas. */
  async getAcessoLiberado(emailUsuario: string) {
    const appData = await this.repository.get();
  
    if (!appData) {
      throw new AppDataNotFoundError();
    }
  
    // Bloqueio desativado: todos podem acessar
    if (!appData.bloquearAcesso) {
      return { acessoLiberado: true };
    }
  
    const temData =
      !!appData.dataInicioAcesso &&
      !!appData.dataFimAcesso;
  
    const temEmail =
      appData.emailsComAcesso.length > 0;
  
    // Bloqueio ativado, mas sem data e sem emails:
    // ninguém pode acessar
    if (!temData && !temEmail) {
      return { acessoLiberado: false };
    }
  
    const agora = new Date();
  
    const dentroDoPeriodo =
      temData &&
      agora >= appData.dataInicioAcesso! &&
      agora <= appData.dataFimAcesso!;
  
    const emailAutorizado =
      temEmail &&
      appData.emailsComAcesso.some(
        (email) => email.toLowerCase() === emailUsuario.toLowerCase(),
      );
  
    // Data + email: precisa cumprir os dois
    if (temData && temEmail) {
      return {
        acessoLiberado: dentroDoPeriodo && emailAutorizado,
      };
    }
  
    // Somente data: qualquer usuário no período
    if (temData) {
      return {
        acessoLiberado: dentroDoPeriodo,
      };
    }
  
    // Somente email: qualquer data, desde que o email esteja autorizado
    return {
      acessoLiberado: emailAutorizado,
    };
  }

  async updateBloqueioAcesso(input: AtualizarBloqueioAcessoInput) {
    const appData = await this.repository.updateBloqueioAcesso({
      bloquearAcesso: input.bloquearAcesso,
      dataInicioAcesso: input.dataInicioAcesso ? new Date(input.dataInicioAcesso) : null,
      dataFimAcesso: input.dataFimAcesso ? new Date(input.dataFimAcesso) : null,
      emailsComAcesso: input.bloquearAcesso ? input.emailsComAcesso : [],
    });
    return {
      bloquearAcesso: appData.bloquearAcesso,
      dataInicioAcesso: appData.dataInicioAcesso,
      dataFimAcesso: appData.dataFimAcesso,
      emailsComAcesso: appData.emailsComAcesso,
    };
  }
}
