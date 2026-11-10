const { verifyAccessToken } = require('../services/token.service');
const ApiError = require('../utils/ApiError');

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const [type, token] = authHeader.split(' ');

  if (type !== 'Bearer' || !token) {
    return next(
      new ApiError(401, 'Authentication required. Provide a Bearer token.')
    );
  }

  try {
    const payload = verifyAccessToken(token);

    req.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role
    };

    return next();
  } catch (error) {
    return next(new ApiError(401, 'Invalid or expired token.'));
  }
}

function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required.'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(
        new ApiError(403, 'You do not have permission to perform this action.')
      );
    }

    return next();
  };
}

module.exports = {
  authenticate,
  authorize
};