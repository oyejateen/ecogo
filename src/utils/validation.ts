/**
 * Validate if the provided string is a valid email format
 * @param email - Email string to validate
 * @returns boolean indicating if the email is valid
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * Requirements:
 * - At least 8 characters long
 * - Contains at least one uppercase letter
 * - Contains at least one lowercase letter
 * - Contains at least one number
 * @param password - Password string to validate
 * @returns boolean indicating if the password meets requirements
 */
export const validatePassword = (password: string): boolean => {
  // Check length
  if (password.length < 8) return false;
  
  // Check for uppercase letter
  if (!/[A-Z]/.test(password)) return false;
  
  // Check for lowercase letter
  if (!/[a-z]/.test(password)) return false;
  
  // Check for number
  if (!/[0-9]/.test(password)) return false;
  
  return true;
};

/**
 * Get password strength feedback messages
 * @param password - Password string to check
 * @returns Array of feedback messages for requirements not met
 */
export const getPasswordFeedback = (password: string): string[] => {
  const feedback: string[] = [];
  
  if (password.length < 8) {
    feedback.push('Password must be at least 8 characters long');
  }
  
  if (!/[A-Z]/.test(password)) {
    feedback.push('Password must contain at least one uppercase letter');
  }
  
  if (!/[a-z]/.test(password)) {
    feedback.push('Password must contain at least one lowercase letter');
  }
  
  if (!/[0-9]/.test(password)) {
    feedback.push('Password must contain at least one number');
  }
  
  return feedback;
}; 