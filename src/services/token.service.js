const jwt = require('jsonwebtoken');
const env = require('../config/env');

const ISSUER = 'secure-connect-platform';

function signAccessToken(user) {
  const payload = {
    sub: user.id || user._id.toString(),
    email: user.email,
    role: user.role
  };

  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
    issuer: ISSUER
  });
}

function verifyAccessToken(token) {
  return jwt.verify(token, env.JWT_SECRET, {
    issuer: ISSUER
  });
}

module.exports = {
  signAccessToken,
  verifyAccessToken
};