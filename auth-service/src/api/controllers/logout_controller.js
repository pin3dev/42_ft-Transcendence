async function logout_controller(request, reply) {
  reply
    .clearCookie('jwt', {
      path: '/', // Garante que está limpando corretamente em todas as rotas
      httpOnly: true,
      sameSite: 'lax',
      secure: false // true se usar HTTPS
    })
    .code(200)
    .send({ message: 'Logout realizado com sucesso.' });
}

module.exports = { logout_controller };
