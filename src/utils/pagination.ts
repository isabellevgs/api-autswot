import { z } from 'zod';

export function parsePage(val: unknown, defaultVal = 1): number {
  if (val === undefined || val === null || val === '') return defaultVal;
  const n = typeof val === 'string' ? parseInt(val, 10) : Number(val);
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : defaultVal;
}

export function parseLimit(val: unknown, defaultVal = 10, max = 100): number {
  if (val === undefined || val === null || val === '') return defaultVal;
  const n = typeof val === 'string' ? parseInt(val, 10) : Number(val);
  if (!Number.isFinite(n) || n < 1) return defaultVal;
  return Math.min(Math.floor(n), max);
}

export const paginationQueryFields = {
  page: z.union([z.string(), z.number()]).optional().transform((val) => parsePage(val)),
  limit: z.union([z.string(), z.number()]).optional().transform((val) => parseLimit(val)),
};
