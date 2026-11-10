const { verifyAccessToken } = require('../services/token.service');

const eventBus = require('../events/eventBus');
const EVENTS = require('../events/events');

const {
  createMessage,
  getRecentMessages
} = require('../models/message.model');

function authenticateSocket(socket, next) {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.query?.token;

    if (!token) {
      return next(new Error('Authentication required'));
    }

    const payload = verifyAccessToken(token);

    socket.user = {
      id: payload.sub,
      email: payload.email,
      role: payload.role
    };

    return next();
  } catch {
    return next(new Error('Invalid or expired token'));
  }
}

function registerChatHandlers(io) {
  io.use(authenticateSocket);

  io.on('connection', (socket) => {
    const user = socket.user;

    socket.join(`user:${user.id}`);
    socket.join('public');

    socket.emit('chat:connected', {
      message: `Welcome ${user.email}`,
      userId: user.id,
      rooms: ['public', `user:${user.id}`]
    });

    socket.broadcast.to('public').emit('chat:presence', {
      userId: user.id,
      email: user.email,
      status: 'online'
    });

    socket.on('chat:history', async (payload, ack) => {
      try {
        const room = payload?.room || 'public';
        const limit = Math.min(Number(payload?.limit) || 50, 100);

        const messages = await getRecentMessages(room, limit);

        if (typeof ack === 'function') {
          ack({
            success: true,
            data: messages
          });
        }
      } catch {
        if (typeof ack === 'function') {
          ack({
            success: false,
            message: 'Unable to load chat history.'
          });
        }
      }
    });

    socket.on('chat:message', async (payload, ack) => {
      try {
        const text =
          typeof payload?.text === 'string' ? payload.text.trim() : '';

        const room =
          typeof payload?.room === 'string' && payload.room.trim()
            ? payload.room.trim()
            : 'public';

        if (!text) {
          if (typeof ack === 'function') {
            ack({
              success: false,
              message: 'Message text is required.'
            });
          }
          return;
        }

        if (text.length > 1000) {
          if (typeof ack === 'function') {
            ack({
              success: false,
              message: 'Message is too long.'
            });
          }
          return;
        }

        if (room.length > 50) {
          if (typeof ack === 'function') {
            ack({
              success: false,
              message: 'Room name is too long.'
            });
          }
          return;
        }

        if (
          room.startsWith('user:') &&
          room !== `user:${user.id}` &&
          user.role !== 'admin'
        ) {
          if (typeof ack === 'function') {
            ack({
              success: false,
              message: 'You cannot send messages to another user room.'
            });
          }
          return;
        }

        const message = await createMessage({
          senderId: user.id,
          senderName: user.email,
          text,
          room
        });

        const event = {
          id: message._id.toString(),
          text: message.text,
          room: message.room,
          sender: {
            id: user.id,
            email: user.email
          },
          createdAt: message.createdAt
        };

        socket.to(room).emit('chat:message', event);

        eventBus.emit(EVENTS.CHAT_MESSAGE, {
          message,
          user
        });

        if (typeof ack === 'function') {
          ack({
            success: true,
            data: event
          });
        }
      } catch {
        if (typeof ack === 'function') {
          ack({
            success: false,
            message: 'Failed to send message.'
          });
        }
      }
    });

    socket.on('typing:start', (payload) => {
      const room = payload?.room || 'public';

      socket.to(room).emit('typing:start', {
        userId: user.id,
        email: user.email
      });
    });

    socket.on('typing:stop', (payload) => {
      const room = payload?.room || 'public';

      socket.to(room).emit('typing:stop', {
        userId: user.id
      });
    });

    socket.on('disconnect', () => {
      socket.broadcast.to('public').emit('chat:presence', {
        userId: user.id,
        email: user.email,
        status: 'offline'
      });
    });
  });
}

module.exports = { registerChatHandlers };