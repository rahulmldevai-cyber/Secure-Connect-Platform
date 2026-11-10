const http = require('http');

const app = require('./app');
const env = require('./config/env');

const { connectDB, closeDB } = require('./config/db');
const { initSocket } = require('./sockets');
const { registerEventListeners } = require('./events/listeners');

async function start() {
  try {
    await connectDB();

    registerEventListeners();

    const server = http.createServer(app);

    initSocket(server);

    server.listen(env.PORT, () => {
      console.log(`Server running on http://localhost:${env.PORT}`);
    });

    const shutdown = async (signal) => {
      console.log(`\n${signal} received. Shutting down...`);

      server.close(async () => {
        await closeDB();
        process.exit(0);
      });
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

start();