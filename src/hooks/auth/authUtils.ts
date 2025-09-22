// Validation utilities for authentication

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): {
  isValid: boolean;
  errors: string[];
} => {
  const errors: string[] = [];
  
  if (password.length < 6) {
    errors.push('Mật khẩu phải có ít nhất 6 ký tự');
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Mật khẩu phải có ít nhất 1 chữ thường');
  }
  
  if (!/(?=.*\d)/.test(password)) {
    errors.push('Mật khẩu phải có ít nhất 1 số');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateFullName = (fullName: string): boolean => {
  return fullName.trim().length >= 2;
};

export const formatAuthError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'Đã xảy ra lỗi không xác định';
};

// Demo account credentials
export const DEMO_ACCOUNTS = {
  user: {
    email: 'minh@example.com',
    password: '123456',
    fullName: 'Minh Nguyen',
  },
  stylist: {
    email: 'stylist@example.com',
    password: 'stylist123',
    fullName: 'Stylist Pro',
  },
};

export const isDemoAccount = (email: string): boolean => {
  return Object.values(DEMO_ACCOUNTS).some(account => account.email === email);
};