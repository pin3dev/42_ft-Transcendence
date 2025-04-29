function buildEvent({ event, source, data, version = "1.0" }) {
    return {
      event,
      version,
      timestamp: new Date().toISOString(),
      source,
      data
    };
  }
  
  module.exports = { buildEvent };
  