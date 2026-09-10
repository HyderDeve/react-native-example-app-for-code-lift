export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const normalizeEmail = (value: string) => value.trim().toLowerCase();

export const validateEmail = (value: string) => {
  if (!value.trim()) return 'Email is required.';
  if (!emailPattern.test(value.trim())) return 'Enter a valid email address.';
  return '';
};

export const validatePassword = (value: string) => {
  if (!value) return 'Password is required.';
  if (value.length < 8) return 'Use at least 8 characters.';
  return '';
};

export const validateName = (value: string) => {
  if (!value.trim()) return 'Name is required.';
  if (value.trim().length < 2) return 'Use at least 2 characters.';
  return '';
};

export const getClerkErrorMessage = (error: unknown, fallback = 'Something went wrong. Please try again.') => {
  if (error && typeof error === 'object') {
    const clerkError = error as { errors?: Array<{ longMessage?: string; message?: string }> };
    const firstError = clerkError.errors?.[0];

    if (firstError?.longMessage) return firstError.longMessage;
    if (firstError?.message) return firstError.message;
  }

  if (error instanceof Error && error.message) return error.message;

  return fallback;
};