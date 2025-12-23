import { normalizeDateToYear } from '../normalizeDateToYear';

describe('normalizeDateToYear', () => {
  it('should return 4-digit year from string', () => {
    expect(normalizeDateToYear('1999')).toBe('1999');
    expect(normalizeDateToYear('2023')).toBe('2023');
  });

  it('should extract year from longer string', () => {
    expect(normalizeDateToYear('Published in 1999')).toBe('1999');
    expect(normalizeDateToYear('1999-01-01')).toBe('1999');
  });

  it('should handle decades', () => {
    expect(normalizeDateToYear('1990s')).toBe('1990');
    expect(normalizeDateToYear('2000s')).toBe('2000');
  });

  it('should return empty for invalid inputs', () => {
    expect(normalizeDateToYear(null)).toBe('');
    expect(normalizeDateToYear('')).toBe('');
    expect(normalizeDateToYear('abc')).toBe('');
    expect(normalizeDateToYear('123')).toBe(''); // 3 digits
    expect(normalizeDateToYear('999')).toBe(''); // below 1000
    expect(normalizeDateToYear('3000')).toBe(''); // above 2999
  });

  it('should handle spaces and special characters', () => {
    expect(normalizeDateToYear('  1999  ')).toBe('1999');
    expect(normalizeDateToYear('1999\u00A0')).toBe('1999'); // NBSP
  });
});
