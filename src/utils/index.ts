export * from './storage';

/**
 * Generate a unique transaction ID
 * React Native compatible implementation
 *
 * @returns Unique transaction ID string
 */
export const generateTransactionId = (): string => {
  const s4 = (): string => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };

  return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
};

/**
 * Validate email format
 *
 * @param email Email string to validate
 * @returns True if email is valid
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone number format (basic validation)
 *
 * @param phone Phone number to validate
 * @returns True if phone number appears valid
 */
export const isValidPhoneNumber = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s-()]{8,}$/;
  return phoneRegex.test(phone.trim());
};
