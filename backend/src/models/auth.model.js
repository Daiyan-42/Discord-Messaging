const pool = require('../db');

exports.findUserByEmail = async (email) => {
  return pool.query(
    `SELECT id, email FROM users WHERE lower(email) = lower($1) LIMIT 1`,
    [email]
  );
};

exports.findUserByUsername = async (username) => {
  return pool.query(
    `SELECT id, username FROM users WHERE lower(username) = lower($1) LIMIT 1`,
    [username]
  );
};

exports.findUserForLogin = async (identifier) => {
  return pool.query(
    `
      SELECT id, email, username, password_hash, display_name, date_of_birth, created_at
      FROM users
      WHERE lower(email) = lower($1) OR lower(username) = lower($1)
      LIMIT 1
    `,
    [identifier]
  );
};

exports.createUser = async ({ email, username, passwordHash, displayName, dateOfBirth }) => {
  return pool.query(
    `
      INSERT INTO users (email, username, password_hash, display_name, date_of_birth)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, email, username, display_name, date_of_birth, created_at
    `,
    [email, username, passwordHash, displayName, dateOfBirth]
  );
};
