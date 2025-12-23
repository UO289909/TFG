
/**
 * Normalizes a text by converting it to lowercase and removing accents.
 * @param text - Text to normalize
 * @returns Normalized text
 */
export const normalizeText = (text: string): string => {

  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

};
