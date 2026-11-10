const {
  findById,
  getAllPublicUsers,
  toPublicUser
} = require('../models/user.model');

const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');

exports.getMe = asyncHandler(async (req, res) => {
  const user = await findById(req.user.id);

  if (!user) {
    throw new ApiError(404, 'User not found.');
  }

  res.status(200).json(
    new ApiResponse(200, 'Current user fetched successfully.', {
      user: toPublicUser(user)
    })
  );
});

exports.listUsers = asyncHandler(async (req, res) => {
  const users = await getAllPublicUsers();

  res.status(200).json(
    new ApiResponse(200, 'Users fetched successfully.', {
      users
    })
  );
});