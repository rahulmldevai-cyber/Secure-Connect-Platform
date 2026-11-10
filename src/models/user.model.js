const { ObjectId } = require('mongodb');
const { getDB } = require('../config/db');

const users = () => getDB().collection('users');

function toPublicUser(user) {
  if (!user) return null;

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}

async function createUser({ name, email, passwordHash, role = 'user' }) {
  const now = new Date();

  const result = await users().insertOne({
    name,
    email: email.toLowerCase().trim(),
    password: passwordHash,
    role,
    createdAt: now,
    updatedAt: now
  });

  const user = await users().findOne({ _id: result.insertedId });

  return toPublicUser(user);
}

async function findByEmail(email) {
  return users().findOne({ email: email.toLowerCase().trim() });
}

async function findById(id) {
  try {
    return await users().findOne({ _id: new ObjectId(id) });
  } catch {
    return null;
  }
}

async function getAllPublicUsers() {
  const allUsers = await users()
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  return allUsers.map(toPublicUser);
}

module.exports = {
  createUser,
  findByEmail,
  findById,
  getAllPublicUsers,
  toPublicUser
};