import { describe, it, expect } from 'bun:test';
import {
  calcularMediaUser,
  mapearFrequenciaParaLabel,
  classificarTracoFO,
  classificarTracoF,
} from '../../utils/calculos.js';

describe('calculos', () => {
  describe('calcularMediaUser', () => {
    it('calcula média com frequência e intensidade', () => {
      const media = calcularMediaUser(3, 2);
      expect(media).toBeCloseTo((3 + 2 * (5 / 3)) / 2);
    });

    it('usa só frequência quando intensidade ausente (CH sem intensidade)', () => {
      expect(calcularMediaUser(4, null)).toBe(4);
      expect(calcularMediaUser(4, undefined)).toBe(4);
    });

    it('retorna null sem frequência', () => {
      expect(calcularMediaUser(null, 2)).toBeNull();
      expect(calcularMediaUser(undefined, 2)).toBeNull();
    });

    it('rejeita frequência fora do range', () => {
      expect(() => calcularMediaUser(0, 2)).toThrow();
      expect(() => calcularMediaUser(6, 2)).toThrow();
    });

    it('rejeita intensidade fora do range quando informada', () => {
      expect(() => calcularMediaUser(3, 0)).toThrow();
      expect(() => calcularMediaUser(3, 4)).toThrow();
    });
  });

  describe('mapearFrequenciaParaLabel', () => {
    it('mapeia labels FO', () => {
      expect(mapearFrequenciaParaLabel(1, 'FO')).toBe('Quase Nunca');
      expect(mapearFrequenciaParaLabel(5, 'FO')).toBe('Quase Sempre');
    });

    it('mapeia labels F', () => {
      expect(mapearFrequenciaParaLabel(1, 'F')).toBe('Nunca');
      expect(mapearFrequenciaParaLabel(5, 'F')).toBe('Quase sempre');
    });
  });

  describe('classificarTracoFO', () => {
    const tracoNeutro = [{ valor: 'Quase Nunca' }];
    const tracoOportunidade = [{ valor: 'Ocasionalmente' }];
    const tracoFraqueza = [{ valor: 'Quase Sempre' }];

    it('prioriza fraqueza', () => {
      expect(classificarTracoFO(5, tracoNeutro, tracoOportunidade, tracoFraqueza)).toBe('fraqueza');
    });

    it('classifica oportunidade', () => {
      expect(classificarTracoFO(3, tracoNeutro, tracoOportunidade, [])).toBe('oportunidade');
    });

    it('classifica neutro', () => {
      expect(classificarTracoFO(1, tracoNeutro, [], [])).toBe('neutro');
    });
  });

  describe('classificarTracoF', () => {
    const tracoNeutro = [{ valor: 'Nunca' }];
    const tracoForca = [{ valor: 'Muito frequentemente' }];
    const tracoFraqueza = [{ valor: 'Quase sempre' }];
    const tracoOportunidade = [{ valor: 'Ocasionalmente' }];

    it('prioriza fraqueza', () => {
      expect(
        classificarTracoF(5, tracoNeutro, tracoForca, tracoFraqueza, tracoOportunidade),
      ).toBe('fraqueza');
    });

    it('classifica forca', () => {
      expect(classificarTracoF(4, tracoNeutro, tracoForca, [], [])).toBe('forca');
    });
  });
});
