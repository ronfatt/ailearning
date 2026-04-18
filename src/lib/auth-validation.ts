const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const passwordRequirementText =
  "Use at least 8 characters with upper and lower case letters and at least one number.";

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function isValidEmail(email: string) {
  return emailPattern.test(email);
}

export function validateFullName(name: string) {
  const trimmed = name.trim();

  if (trimmed.length < 2) {
    return "Please enter your full name.";
  }

  if (trimmed.length > 80) {
    return "Full name is too long.";
  }

  return null;
}

export function validatePassword(password: string) {
  if (password.length < 8) {
    return passwordRequirementText;
  }

  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasDigit = /\d/.test(password);

  if (!hasUpper || !hasLower || !hasDigit) {
    return passwordRequirementText;
  }

  return null;
}
