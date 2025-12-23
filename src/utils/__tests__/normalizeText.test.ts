import { normalizeText } from '../normalizeText';

describe('normalizeText', () => {
  it('should convert text to lowercase', () => {
    expect(normalizeText('HELLO')).toBe('hello');
    expect(normalizeText('Hello World')).toBe('hello world');
  });

  it('should remove accents', () => {
    expect(normalizeText('café')).toBe('cafe');
    expect(normalizeText('naïve')).toBe('naive');
    expect(normalizeText('résumé')).toBe('resume');
    expect(normalizeText('ñoño')).toBe('nono');
  });

  it('should handle text without accents', () => {
    expect(normalizeText('hello')).toBe('hello');
    expect(normalizeText('world')).toBe('world');
  });

  it('should handle empty string', () => {
    expect(normalizeText('')).toBe('');
  });

  it('should handle numbers and symbols', () => {
    expect(normalizeText('123!@#')).toBe('123!@#');
    expect(normalizeText('Café123')).toBe('cafe123');
  });
});
