const Redis = require("ioredis");

const eventCnn = new Redis({
  host: "event-bus",
  port: 6379,
});

function subscribeToEvent(channel, callback) {
  eventCnn.subscribe(channel);

  eventCnn.on("message", (receivedChannel, message) => {
    if (receivedChannel === channel) {
      try {
        // Tenta fazer o parse do JSON
        const parsedEvent = JSON.parse(message);
        callback(parsedEvent);
      } catch (err) {
        console.error(`[Redis] Erro ao fazer parse do evento: ${err.message}`);
        console.error(`[Redis] Mensagem recebida: ${message}`);
        return;
      }
    }
  });
}

module.exports = { subscribeToEvent };