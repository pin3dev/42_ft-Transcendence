const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getMatchHistory(userId) {
  try {
    // Buscar as últimas 5 partidas onde o usuário participou
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
            id: true
          }
        }
      },
      orderBy: {
        started_at: 'desc'
      },
      take: 5
    });

    // Transformar os dados para o formato simplificado
    const simplifiedMatches = matches.map(match => {
      const isPlayer1 = match.player1_id === userId;
      const adversarioId = isPlayer1 ? match.player2_id : match.player1_id;
      const won = match.winner_id === userId;
      
      return {
        adversario_id: adversarioId,
        resultado: won ? 'Vitoria' : 'Derrota',
        placar: match.score,
        data: match.started_at,
        tipo: match.tournament_id ? 'Torneio' : '1v1'
      };
    });

    return simplifiedMatches;

  } catch (error) {
    console.error('Erro ao buscar histórico de partidas:', error);
    throw error;
  }
}

module.exports = { getMatchHistory };