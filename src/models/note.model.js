const { ObjectId } = require('mongodb');
const { getDB } = require('../config/db');

const notes = () => getDB().collection('notes');

async function createNote({ userId, title, content, tags = [] }) {
  const now = new Date();

  const result = await notes().insertOne({
    userId: new ObjectId(userId),
    title,
    content,
    tags,
    createdAt: now,
    updatedAt: now
  });

  return notes().findOne({ _id: result.insertedId });
}

async function findNotesByUser(userId) {
  return notes()
    .find({ userId: new ObjectId(userId) })
    .sort({ updatedAt: -1 })
    .toArray();
}

async function findAllNotes() {
  return notes()
    .find({})
    .sort({ updatedAt: -1 })
    .toArray();
}

async function findNoteById(id) {
  try {
    return await notes().findOne({ _id: new ObjectId(id) });
  } catch {
    return null;
  }
}

async function updateNoteByIdAny(id, updates) {
  try {
    const set = {};

    if (updates.title !== undefined) set.title = updates.title;
    if (updates.content !== undefined) set.content = updates.content;
    if (updates.tags !== undefined) set.tags = updates.tags;

    set.updatedAt = new Date();

    const filter = { _id: new ObjectId(id) };

    const result = await notes().updateOne(filter, { $set: set });

    if (!result.matchedCount) {
      return null;
    }

    return notes().findOne(filter);
  } catch {
    return null;
  }
}

async function deleteNoteByIdAny(id) {
  try {
    const result = await notes().deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  } catch {
    return false;
  }
}

module.exports = {
  createNote,
  findNotesByUser,
  findAllNotes,
  findNoteById,
  updateNoteByIdAny,
  deleteNoteByIdAny
};