const { getDB } = require('../config/db');

async function createAuditLog(event, payload = {}) {
  try {
    const db = getDB();

    await db.collection('audit_logs').insertOne({
      event,
      payload,
      createdAt: new Date()
    });
  } catch (error) {
    console.error('Failed to write audit log:', error.message);
  }
}

module.exports = { createAuditLog };