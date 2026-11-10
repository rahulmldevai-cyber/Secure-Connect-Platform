const { Server } = require('socket.io');

const { setIO } = require('./io');
const { registerChatHandlers } = require('./chat.socket');

function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  setIO(io);
  registerChatHandlers(io);

  return io;
}

module.exports = { initSocket };