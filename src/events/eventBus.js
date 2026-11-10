const { EventEmitter } = require('node:events');

class EventBus extends EventEmitter {
  emitAsync(event, payload) {
    this.emit(event, payload);
  }
}

const eventBus = new EventBus();
eventBus.setMaxListeners(30);

module.exports = eventBus;