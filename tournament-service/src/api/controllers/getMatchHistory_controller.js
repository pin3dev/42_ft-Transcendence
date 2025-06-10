const { getMatchHistory } = require("../../application/getMatchHistory");

async function getMatchHistory_controller(request, reply) {
  try {
    const userId = request.headers["x-user-id"];


    if (!userId) {
      return reply.status(400).send({
        success: false,
        error: 'User ID é obrigatório'
      });
    }

    const matchHistory = await getMatchHistory(userId);

    if (!matchHistory || matchHistory.length === 0) {
      return reply.status(404).send({
        success: false,
        error: 'Nenhum histórico de partidas encontrado para este usuário'
      });
    }

    return reply.send({
      success: true,
      data: matchHistory
    });

  } catch (error) {
    console.error('Erro no controller de histórico de partidas:', error);
    return reply.status(500).send({
      success: false,
      error: 'Erro interno do servidor'
    });
  }
}

module.exports = { getMatchHistory_controller };