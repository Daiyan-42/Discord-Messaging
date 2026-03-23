const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authModel = require('../models/auth.model');
const env = require('../config/env');

const SALT_ROUNDS = 10;

const createHttpError = (statusCode, message) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const createAuthPayload = (user) => ({
  id: user.id,
  email: user.email,
  username: user.username,
  displayName: user.display_name,
  dateOfBirth: user.date_of_birth,
  createdAt: user.created_at,
});

const signAccessToken = (user) => {
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      username: user.username,
    },
    env.jwtSecret,
    { expiresIn: env.jwtExpiresIn }
  );
};

exports.registerUser = async ({ email, username, password, displayName, dateOfBirth }) => {
  if (!env.jwtSecret) {
    throw createHttpError(500, 'JWT configuration is missing');
  }

  const existingEmail = await authModel.findUserByEmail(email);
  if (existingEmail.rowCount > 0) {
    throw createHttpError(409, 'Email is already registered');
  }

  const existingUsername = await authModel.findUserByUsername(username);
  if (existingUsername.rowCount > 0) {
    throw createHttpError(409, 'Username is already taken');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

  let createdUser;

  try {
    const result = await authModel.createUser({
      email,
      username,
      passwordHash,
      displayName,
      dateOfBirth,
    });

    createdUser = result.rows[0];
  } catch (error) {
    if (error.code === '23505') {
      if ((error.constraint || '').includes('users_email_key')) {
        throw createHttpError(409, 'Email is already registered');
      }

      if ((error.constraint || '').includes('users_username_key')) {
        throw createHttpError(409, 'Username is already taken');
      }

      throw createHttpError(409, 'User already exists');
    }

    throw error;
  }

  const token = signAccessToken(createdUser);

  return {
    token,
    user: createAuthPayload(createdUser),
  };
};

exports.loginUser = async ({ identifier, password }) => {
  if (!env.jwtSecret) {
    throw createHttpError(500, 'JWT configuration is missing');
  }

  const result = await authModel.findUserForLogin(identifier);

  if (result.rowCount === 0) {
    throw createHttpError(401, 'Invalid credentials');
  }

  const user = result.rows[0];
  const passwordMatches = await bcrypt.compare(password, user.password_hash);

  if (!passwordMatches) {
    throw createHttpError(401, 'Invalid credentials');
  }

  const token = signAccessToken(user);

  return {
    token,
    user: createAuthPayload(user),
  };
};
