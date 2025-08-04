const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function getMatchHistory(userId) {
  try {
    //console.logog(`🔍 Buscando histórico para userId: ${userId}`);
    
    // Buscar as últimas 5 partidas onde o usuário participou
    const matches = await prisma.match.findMany({
      where: {
        OR: [
          { player1_id: userId },
          { player2_id: userId }
        ]
      },
      orderBy: {
        started_at: 'desc'
      },
      take: 5
    });

    // //console.logog(`📊 Encontradas ${matches.length} partidas para o usuário ${userId}`);
    
    // // Log de todas as partidas no banco para debug
    // const allMatches = await prisma.match.findMany({
    //   select: {
    //     id: true,
    //     player1_id: true,
    //     player2_id: true,
    //     winner_id: true
    //   }
    // });
    // //console.logog(`🗃️ Total de partidas no banco: ${allMatches.length}`);
    // //console.logog('📋 IDs de jogadores nas partidas:', allMatches.map(m => `${m.player1_id} vs ${m.player2_id}`));

    // Transformar os dados para o formato simplificado
    const simplifiedMatches = matches.map(match => {
      const isPlayer1 = match.player1_id === userId;
      const adversarioId = isPlayer1 ? match.player2_id : match.player1_id;
      
      let resultado;
      if (match.winner_id === null) {
        resultado = 'Empate';
      } else if (match.winner_id === userId) {
        resultado = 'Vitoria';
      } else {
        resultado = 'Derrota';
      }
      
      return {
        adversario_id: adversarioId,
        resultado: resultado,
        placar: match.score,
        data: match.started_at,
        tipo: match.tournament_id ? 'Torneio' : '1v1'
      };
    });

    //console.logog(`✅ Retornando ${simplifiedMatches.length} partidas processadas`);
    return simplifiedMatches;

  } catch (error) {
    console.error('❌ Erro ao buscar histórico de partidas:', error);
    throw error;
  }
}

module.exports = { getMatchHistory };