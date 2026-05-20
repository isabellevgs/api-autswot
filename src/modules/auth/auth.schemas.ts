import { z } from 'zod';

const diagnosticadoTeaEnum = z.enum(['sim', 'nao']);
const outrasCondicoesEnum = z.enum(['sim', 'nao']);

const acessoMedicacoesEnum = z.enum([
  'sim',
  'nao_nao_quero',
  'nao_sem_recursos',
]);

const terapiasEnum = z.enum([
  'sim_todas_recomendadas',
  'sim_parcialmente_tempo',
  'sim_parcialmente_dinheiro',
  'nao_nao_quero',
  'nao_sem_dinheiro',
]);

const corRacaEnum = z.enum(['preto', 'pardo', 'branca', 'amarela']);

const generoEnum = z.enum(['masculino', 'feminino', 'outro', 'prefiro_nao_dizer']);

const escolaridadeEnum = z.enum([
  'ensino_basico_1_4',
  'ensino_fundamental_5_9',
  'ensino_medio',
  'graduacao_curso_ou_completa',
  'pos_graduacao_curso_ou_completa',
]);

const comQuemMoraEnum = z.enum([
  'sozinho',
  'pais_parentes',
  'amigos_colegas',
  'parceiro_romantico',
]);

const situacaoTrabalhoEnum = z.enum(['clt', 'autonomo_empreendedor', 'nao']);

const nivelRendaEnum = z.enum([
  'sem_renda',
  'bolsa_familia_bpc',
  'ate_1_sm',
  'ate_2_sm',
  'ate_3_sm',
  'mais_3_sm',
]);

const burnoutEnum = z.enum(['sim', 'nao']);

const pensamentosSuicidioEnum = z.enum([
  'nunca',
  'pensamento_breve',
  'plano_sem_tentativa',
  'plano_pensou_executar',
  'tentativa_parar_dor',
  'tentativa_queria_morrer',
]);

const frequenciaSuicidio12mEnum = z.enum([
  'nunca',
  'raramente',
  'as_vezes',
  'frequentemente',
  'muito_frequentemente',
]);

export const profileRegistrationFieldsSchema = z.object({
  especialistaIndicacao: z
    .string()
    .min(2, 'Nome do especialista/pesquisador é obrigatório')
    .max(300),
  diagnosticadoTea: diagnosticadoTeaEnum,
  outrasCondicoesSaude: outrasCondicoesEnum,
  outrasCondicoesDetalhe: z.string().max(2000),
  acessoMedicacoes: acessoMedicacoesEnum,
  terapiasNaoMedicamentosas: terapiasEnum,
  idade: z.string().min(1, 'Idade é obrigatória').max(30),
  corRaca: corRacaEnum,
  genero: generoEnum,
  generoOutroTexto: z.string().max(200),
  profissao: z.string().min(1, 'Profissão é obrigatória').max(300),
  escolaridade: escolaridadeEnum,
  comQuemMora: comQuemMoraEnum,
  situacaoTrabalho: situacaoTrabalhoEnum,
  auxilioGovernoExperiencia: z.string().min(1, 'Este campo é obrigatório').max(4000),
  nivelRenda: nivelRendaEnum,
  burnout: burnoutEnum,
  burnoutDescricao: z.string().max(4000),
  pensamentosSuicidio: pensamentosSuicidioEnum,
  frequenciaSuicidio12meses: frequenciaSuicidio12mEnum,
  contouSuicidioOuBarreiras: z.string().min(1, 'Este campo é obrigatório').max(4000),
  probabilidadeSuicidioFuturoExplicacao: z.string().min(1, 'Este campo é obrigatório').max(4000),
});

export const registerSchema = z
  .object({
    email: z
      .string()
      .email('Email inválido')
      .transform((e) => e.trim().toLowerCase()),
    name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').max(100, 'Nome muito longo'),
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres').max(100, 'Senha muito longa'),
  })
  .merge(profileRegistrationFieldsSchema)
  .superRefine((data, ctx) => {
    if (data.outrasCondicoesSaude === 'sim' && !data.outrasCondicoesDetalhe.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Indique quais condições no campo ou em "outro"',
        path: ['outrasCondicoesDetalhe'],
      });
    }
    if (data.genero === 'outro' && !data.generoOutroTexto.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Descreva como você se identifica',
        path: ['generoOutroTexto'],
      });
    }
    if (data.burnout === 'sim' && !data.burnoutDescricao.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Descreva sua experiência com burnout',
        path: ['burnoutDescricao'],
      });
    }
  });

export const loginSchema = z.object({
  email: z
    .string()
    .email('Email inválido')
    .transform((e) => e.trim().toLowerCase()),
  password: z.string().min(1, 'Senha é obrigatória'),
});

export const updateProfileSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres').max(100, 'Nome muito longo').optional(),
  email: z
    .string()
    .email('Email inválido')
    .transform((e) => e.trim().toLowerCase())
    .optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
  newPassword: z.string().min(6, 'Nova senha deve ter pelo menos 6 caracteres').max(100, 'Senha muito longa'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token é obrigatório'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;
export type ProfileRegistrationFields = z.infer<typeof profileRegistrationFieldsSchema>;
