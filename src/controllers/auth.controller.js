const {
  createUser,
  findByEmail,
  toPublicUser
} = require('../models/user.model');

const {
  hashPassword,
  verifyPassword
} = require('../services/password.service');

const { signAccessToken } = require('../services/token.service');

const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

const eventBus = require('../events/eventBus');
const EVENTS = require('../events/events');

const env = require('../config/env');

const {
  isValidEmail,
  isValidPassword,
  isValidNonEmptyString
} = require('../utils/validators');

exports.signup = asyncHandler(async (req, res) => {
  const { name, email, password, role, adminSecret } = req.body;

  if (!isValidNonEmptyString(name, 80)) {
    throw new ApiError(400, 'Name is required and must be 1-80 characters.');
  }

  if (!isValidEmail(email)) {
    throw new ApiError(400, 'A valid email is required.');
  }

  if (!isValidPassword(password)) {
    throw new ApiError(
      400,
      'Password must be at least 8 characters and include uppercase, lowercase, and a number.'
    );
  }

  if (role && !['user', 'admin'].includes(role)) {
    throw new ApiError(400, 'Role must be either user or admin.');
  }

  const existingUser = await findByEmail(email);

  if (existingUser) {
    throw new ApiError(409, 'An account with this email already exists.');
  }

  let assignedRole = 'user';

  if (role === 'admin') {
    if (!env.ADMIN_SECRET || adminSecret !== env.ADMIN_SECRET) {
      throw new ApiError(403, 'Admin signup requires a valid admin secret.');
    }

    assignedRole = 'admin';
  }

  const passwordHash = await hashPassword(password);

  const user = await createUser({
    name,
    email,
    passwordHash,
    role: assignedRole
  });

  eventBus.emit(EVENTS.USER_REGISTERED, user);

  res.status(201).json(
    new ApiResponse(201, 'Account created successfully.', {
      user
    })
  );
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!isValidEmail(email)) {
    throw new ApiError(400, 'A valid email is required.');
  }

  if (typeof password !== 'string' || password.length === 0) {
    throw new ApiError(400, 'Password is required.');
  }

  const user = await findByEmail(email);

  if (!user) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  const isPasswordValid = await verifyPassword(password, user.password);

  if (!isPasswordValid) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  const token = signAccessToken(user);
  const publicUser = toPublicUser(user);

  eventBus.emit(EVENTS.USER_LOGIN, publicUser);

  res.status(200).json(
    new ApiResponse(200, 'Login successful.', {
      token,
      tokenType: 'Bearer',
      expiresIn: env.JWT_EXPIRES_IN,
      user: publicUser
    })
  );
});