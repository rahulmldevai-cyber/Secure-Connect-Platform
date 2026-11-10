const { ObjectId } = require('mongodb');
const { getDB } = require('../config/db');

const messages = () => getDB().collection('messages');

async function createMessage({ senderId, senderName, text, room = 'public' }) {
  const now = new Date();

  const result = await messages().insertOne({
    senderId: new ObjectId(senderId),
    senderName,
    text,
    room,
    createdAt: now
  });

  return messages().findOne({ _id: result.insertedId });
}

async function getRecentMessages(room = 'public', limit = 50) {
  return messages()
    .find({ room })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
}

module.exports = {
  createMessage,
  getRecentMessages
};