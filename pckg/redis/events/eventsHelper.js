const EventTypes = {
    USER_REGISTERED: "user.registered",
    USER_DELETED: "user.deleted",
    // USER_2FA_VERIFIED: "user.2fa.verified",
    // EMAIL_SENT: "email.sent"
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
  