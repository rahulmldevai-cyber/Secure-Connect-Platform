const { MongoClient } = require('mongodb');
const env = require('./env');

let client;
let db;

async function connectDB() {
  if (db) return db;

  client = new MongoClient(env.MONGO_URI);
  await client.connect();

  db = client.db(env.DB_NAME);

  await db.collection('users').createIndex({ email: 1 }, { unique: true });
  await db.collection('notes').createIndex({ userId: 1, updatedAt: -1 });
  await db.collection('messages').createIndex({ room: 1, createdAt: -1 });
  await db.collection('audit_logs').createIndex({ createdAt: -1 });

  return db;
}

function getDB() {
  if (!db) {
    throw new Error('Database is not connected');
  }
  return db;
}

async function closeDB() {
  if (client) {
    await client.close();
  }
}

module.exports = { connectDB, getDB, closeDB };