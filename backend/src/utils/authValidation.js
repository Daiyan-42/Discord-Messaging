const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_REGEX = /^(?!.*\.\.)[a-z0-9._]{2,32}$/;
const DATE_OF_BIRTH_REGEX = /^\d{4}-\d{2}-\d{2}$/;

const isValidDateOfBirth = (value) => {
  if (!DATE_OF_BIRTH_REGEX.test(value)) return false;

  const parsedDate = new Date(`${value}T00:00:00.000Z`);
  if (Number.isNaN(parsedDate.getTime())) return false;

  // Ensure input is a real calendar date and not a parsed overflow date.
  if (parsedDate.toISOString().slice(0, 10) !== value) return false;

  const today = new Date();
  today.setUTCHours(23, 59, 59, 999);

  return parsedDate <= today;
};

const validateRegisterInput = (body = {}) => {
  const errors = {};
  const rawDisplayName = body.displayName ?? body.display_name;
  const rawDateOfBirth = body.dateOfBirth ?? body.date_of_birth;

  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const username = typeof body.username === 'string' ? body.username.trim().toLowerCase() : '';
  const password = typeof body.password === 'string' ? body.password : '';
  const dateOfBirth = typeof rawDateOfBirth === 'string' ? rawDateOfBirth.trim() : '';

  let displayName = null;
  if (rawDisplayName !== undefined && rawDisplayName !== null) {
    displayName = String(rawDisplayName).trim();

    if (displayName.length < 1 || displayName.length > 32) {
      errors.displayName = 'Display name must be between 1 and 32 characters';
    }
  }

  if (!email || !EMAIL_REGEX.test(email)) {
    errors.email = 'A valid email is required';
  }

  if (!username || !USERNAME_REGEX.test(username)) {
    errors.username = 'Username must be 2-32 chars, lowercase a-z, 0-9, underscore (_) or period (.), and no consecutive periods';
  }

  if (!password || password.length < 8) {
    errors.password = 'Password must be at least 8 characters long';
  }

  if (!dateOfBirth || !isValidDateOfBirth(dateOfBirth)) {
    errors.dateOfBirth = 'dateOfBirth must be a valid date in YYYY-MM-DD format and cannot be in the future';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    value: {
      email,
      username,
      password,
      dateOfBirth,
      displayName,
    },
  };
};

const validateLoginInput = (body = {}) => {
  const errors = {};
  const rawIdentifier = body.identifier ?? body.emailOrUsername;

  const identifier = typeof rawIdentifier === 'string' ? rawIdentifier.trim() : '';
  const password = typeof body.password === 'string' ? body.password : '';

  if (!identifier) {
    errors.identifier = 'Identifier (email or username) is required';
  } else {
    const normalizedIdentifier = identifier.toLowerCase();
    const isEmail = EMAIL_REGEX.test(normalizedIdentifier);
    const isUsername = USERNAME_REGEX.test(normalizedIdentifier);

    if (!isEmail && !isUsername) {
      errors.identifier = 'Identifier must be a valid email or a valid username';
    }
  }

  if (!password) {
    errors.password = 'Password is required';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    value: {
      identifier: identifier.toLowerCase(),
      password,
    },
  };
};

module.exports = {
  validateRegisterInput,
  validateLoginInput,
};
