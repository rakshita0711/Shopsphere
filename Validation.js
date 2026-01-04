// ================= EMAIL VALIDATION =================
export const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// ================= PASSWORD VALIDATION =================
export const isValidPassword = (password) => {
  return password.length >= 6;
};

// ================= CONFIRM PASSWORD =================
export const isValidConfirmPassword = (password, confirmPassword) => {
  return confirmPassword.length > 0 && password === confirmPassword;
};

// ================= LOGIN VALIDATION =================
// Login using EMAIL + PASSWORD
export const isLoginValid = (email, password) => {
  return isValidEmail(email) && isValidPassword(password);
};

// ================= REGISTER VALIDATION =================
// Register using EMAIL + PASSWORD + CONFIRM PASSWORD
export const isRegisterValid = (email, password, confirmPassword) => {
  return (
    isValidEmail(email) &&
    isValidPassword(password) &&
    isValidConfirmPassword(password, confirmPassword)
  );
};


export const isValidName = (name) => {
  if (!name) return false;
  const trimmed = name.trim();
  return trimmed.length >= 2 && trimmed.length <= 14;
};
