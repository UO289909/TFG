
/**
 * Normalizes a publish date string to a 4-digit year.
 * @param publishDate - A string representing a date received from OpenLibrary API,
 * which may contain a full year (e.g., "1999"), a decade (e.g., "1990s"), or be null/empty.
 * @returns Normalized 4-digit year as a string, or an empty string if no valid year is found.
 */
export const normalizeDateToYear = (publishDate: string | null): string => {

    // If the input is an array, take the first non-empty value
    if (Array.isArray(publishDate)) {
        const first = publishDate.find(v => v != null && String(v).trim() !== '');
        return normalizeDateToYear(first ?? '');
    }

    // Forcing to string and trimming
    let raw = String(publishDate).trim();
    if (!raw) { return ''; }

    // Normalize weird spaces (NBSP, etc.)
    raw = raw.replace(/\u00A0/g, ' ');

    // (1) Look for a standalone 4-digit year (avoid picking part of longer numbers)
    const year4 = raw.match(/(?<!\d)(\d{4})(?!\d)/);
    if (year4) {
        const y = parseInt(year4[1], 10);
        // Validación básica de rango (ajústalo si te interesa otro rango)
        if (y >= 1000 && y <= 2999) { return String(y); }
    }

    // (2) Look for decades like "1990s"
    const decade = raw.match(/(?<!\d)(\d{3})0s\b/i);
    if (decade) { return decade[1] + '0'; }

    // No valid year found
    return '';

};
