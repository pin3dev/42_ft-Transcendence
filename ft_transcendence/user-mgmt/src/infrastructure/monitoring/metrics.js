const client = require("prom-client");

module.exports = {
  profileCreated: new client.Counter({
    name: "user_profile_creations_total",
    help: "Perfis de usuário criados",
  }),

  profileCreationFailed: new client.Counter({
    name: "user_profile_creation_failures_total",
    help: "Falhas na criação de perfis de usuário",
  }),

  profileUploaded: new client.Counter({
    name: "profile_avatar_uploads_total",
    help: "Uploads de avatar",
  }),

  userSearched: new client.Counter({
    name: "user_search_total",
    help: "Buscas de usuários",
  }),

  friendshipRequested: new client.Counter({
    name: "friend_requests_total",
    help: "Solicitações de amizade enviadas",
  }),

  friendshipAccepted: new client.Counter({
    name: "friend_requests_accepted_total",
    help: "Solicitações de amizade aceitas",
  }),
  
  friendshipRejected: new client.Counter({ 
    name: "friend_requests_rejected_total",
    help: "Solicitações de amizade rejeitadas",
  }),

  friendshipError: new client.Counter({
    name: "friendship_errors_total",
    help: "Erros ao processar solicitações de amizade",
  }),

};
