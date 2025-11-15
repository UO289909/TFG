
/**
 * Validates an email string.
 * @param email The email string to validate.
 * @returns True if the email is valid, false otherwise.
 */
export const isValidEmail = (email: string) => {
  // basic pattern: non-whitespace/non-@ local, single @, domain with at least one dot
  const basic = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!basic.test(email)) {
    return false;
  }

  // reject consecutive dots anywhere (e.g., "test..double@example.com")
  if (email.includes('..')) {
    return false;
  }

  // split local and domain parts and ensure they don't start or end with a dot
  const [local, domain] = email.split('@');
  if (!local || !domain) {
    return false;
  }
  if (local.startsWith('.') || local.endsWith('.') || domain.startsWith('.') || domain.endsWith('.')) {
    return false;
  }

  return true;
};
