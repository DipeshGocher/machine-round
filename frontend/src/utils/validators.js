export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
  return emailRegex.test(email.trim());
};

export const validatePassword = (password) => {
  if (!password || typeof password !== 'string') return false;
  if (password.length < 8 || password.length > 20) return false;

  const uppercaseRegex = /[A-Z]/;
  const lowercaseRegex = /[a-z]/;
  const numberRegex = /[0-9]/;
  const specialCharRegex = /[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/?]/;

  return (
    uppercaseRegex.test(password) &&
    lowercaseRegex.test(password) &&
    numberRegex.test(password) &&
    specialCharRegex.test(password)
  );
};

export const validateUrl = (url) => {
  if (!url || typeof url !== 'string' || url.trim() === '') return true;
  try {
    new URL(url);
    return true;
  } catch (e) {
    return false;
  }
};
