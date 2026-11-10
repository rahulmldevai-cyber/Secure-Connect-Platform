const express = require('express');

const {
  authenticate,
  authorize
} = require('../middleware/auth.middleware');

const {
  getMe,
  listUsers
} = require('../controllers/user.controller');

const router = express.Router();

router.get('/me', authenticate, getMe);

router.get(
  '/',
  authenticate,
  authorize('admin'),
  listUsers
);

module.exports = router;