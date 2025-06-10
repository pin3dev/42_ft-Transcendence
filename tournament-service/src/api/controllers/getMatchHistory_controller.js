const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getMatchHistory(request, reply) {
  try {
    const { userId } = request.params;
    const limit = 20; // Limite fixo de 20 partidas mais recentes

    if (!userId) {
      return reply.status(400).send({
        error: 'User ID is required'
      });
    }

    // Buscar as últimas partidas onde o usuário participou
    const matches = await prisma.match.findMany({
      where: {
        OR: [
          { player1_id: userId },
          { player2_id: userId }
        ]
      },
      include: {
        tournament: {
          select: {
            id: true,
            is_private: true
          }
        }
      },
      orderBy: {
        started_at: 'desc'
      },
      take: limit
    });

    // Formatar os dados para o frontend
    const matchHistory = matches.map(match => {
      const isPlayer1 = match.player1_id === userId;
      const opponentId = isPlayer1 ? match.player2_id : match.player1_id;
      const won = match.winner_id === userId;
      
      // Calcular duração da partida
      const duration = Math.floor((new Date(match.ended_at) - new Date(match.started_at)) / 1000);
      const minutes = Math.floor(duration / 60);
      const seconds = duration % 60;

      return {
        matchId: match.id,
        opponent: {
          userId: opponentId
        },
        result: {
          won: won,
          status: won ? 'Vitoria' : 'Derrota'
        },
        score: match.score,
        date: match.started_at,
        duration: {
          total_seconds: duration,
          formatted: `${minutes}m${seconds.toString().padStart(2, '0')}s`
        },
        gameType: match.tournament_id ? 'Torneio' : '1v1',
        tournament: match.tournament ? {
          id: match.tournament.id,
          isPrivate: match.tournament.is_private
        } : null
      };
    });

    return reply.send({
      success: true,
      data: {
        matches: matchHistory,
        total: matches.length
      }
    });

  } catch (error) {
    console.error('Error fetching match history:', error);
    return reply.status(500).send({
      error: 'Internal server error',
      message: error.message
    });
  }
}

module.exports = { getMatchHistory };