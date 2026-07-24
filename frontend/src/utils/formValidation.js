export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const validatePassword = (password) => {
  return password && password.length >= 6;
};

export const validateRequired = (value) => {
  return value !== undefined && value !== null && String(value).trim() !== '';
};

export const validateForm = (fields = {}) => {
  const errors = {};

  for (const [key, rules] of Object.entries(fields)) {
    const { value, required, isEmail, minLength } = rules;

    if (required && !validateRequired(value)) {
      errors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required`;
      continue;
    }

    if (isEmail && value && !validateEmail(value)) {
      errors[key] = 'Invalid email address';
      continue;
    }

    if (minLength && value && value.length < minLength) {
      errors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} must be at least ${minLength} characters`;
      continue;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
