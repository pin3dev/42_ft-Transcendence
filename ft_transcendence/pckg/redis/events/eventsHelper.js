const EventTypes = {
    USER_REGISTERED: "user.registered",
    USER_DELETED: "user.deleted",
    MATCH_FINISHED: "match.finished",
    TOURNAMENT_CREATED: "tournament.created",
};
  
function buildEvent({ event, source, data, version = "1.0" }) {
    return {
        event,
        version,
        timestamp: new Date().toISOString(),
        source,
        data
    };
}
  
module.exports = { 
    buildEvent,
    EventTypes
};
  