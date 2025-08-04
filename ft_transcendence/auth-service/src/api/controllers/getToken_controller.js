async function getToken_controller(request, reply) {
  // Esta rota deve ser protegida - o usuário já está autenticado via cookie
  // O cookie JWT deve estar presente e válido para chegar até aqui
  
  try {
    // Obtém os dados do usuário das informações passadas pelo API Gateway
    const userId = request.headers['x-user-id'];
    const email = request.headers['x-user-email'];
    
    if (!userId || !email) {
      return reply.code(401).send({ error: "Dados de autenticação inválidos" });
    }
    
    // Gera um novo JWT token para uso no WebSocket
    const jwtToken = await reply.jwtSign(
      {
        user_id: parseInt(userId),
        email: email
      },
      { expiresIn: "1h" }
    );

    return reply.code(200).send({
      token: jwtToken,
      user_id: parseInt(userId),
      message: "Token JWT gerado com sucesso"
    });

  } catch (error) {
    console.error('Erro ao gerar token JWT:', error);
    return reply.code(500).send({ error: "Erro interno do servidor" });
  }
}

module.exports = { getToken_controller };
