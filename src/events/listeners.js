const eventBus = require('./eventBus');
const EVENTS = require('./events');
const { createAuditLog } = require('../models/audit.model');
const { getIO } = require('../sockets/io');

const safe = (handler) => async (payload) => {
  try {
    await handler(payload);
  } catch (error) {
    console.error('Event listener error:', error.message);
  }
};

function registerEventListeners() {
  eventBus.on(
    EVENTS.USER_REGISTERED,
    safe(async (user) => {
      console.log(`[event] New user registered: ${user.email}`);

      await createAuditLog(EVENTS.USER_REGISTERED, {
        userId: user.id,
        email: user.email,
        role: user.role
      });
    })
  );

  eventBus.on(
    EVENTS.USER_LOGIN,
    safe(async (user) => {
      console.log(`[event] User logged in: ${user.email}`);

      await createAuditLog(EVENTS.USER_LOGIN, {
        userId: user.id,
        email: user.email
      });
    })
  );

  eventBus.on(
    EVENTS.NOTE_CREATED,
    safe(async ({ note, user }) => {
      console.log(`[event] Note created by ${user.email}`);

      await createAuditLog(EVENTS.NOTE_CREATED, {
        userId: user.id,
        noteId: note._id ? note._id.toString() : null
      });

      const io = getIO();

      if (io) {
        io.to(`user:${user.id}`).emit('notification', {
          type: 'note.created',
          message: 'Your note was created.',
          noteId: note._id ? note._id.toString() : null
        });
      }
    })
  );

  eventBus.on(
    EVENTS.NOTE_UPDATED,
    safe(async ({ note, user }) => {
      console.log(`[event] Note updated by ${user.email}`);

      await createAuditLog(EVENTS.NOTE_UPDATED, {
        userId: user.id,
        noteId: note._id ? note._id.toString() : null
      });

      const io = getIO();

      if (io) {
        io.to(`user:${user.id}`).emit('notification', {
          type: 'note.updated',
          message: 'Your note was updated.',
          noteId: note._id ? note._id.toString() : null
        });
      }
    })
  );

  eventBus.on(
    EVENTS.NOTE_DELETED,
    safe(async ({ note, user }) => {
      console.log(`[event] Note deleted by ${user.email}`);

      await createAuditLog(EVENTS.NOTE_DELETED, {
        userId: user.id,
        noteId: note._id ? note._id.toString() : null
      });
    })
  );

  eventBus.on(
    EVENTS.CHAT_MESSAGE,
    safe(async ({ message, user }) => {
      console.log(
        `[event] Chat message from ${user.email} in room ${message.room}`
      );

      await createAuditLog(EVENTS.CHAT_MESSAGE, {
        userId: user.id,
        room: message.room
      });
    })
  );
}

module.exports = { registerEventListeners };