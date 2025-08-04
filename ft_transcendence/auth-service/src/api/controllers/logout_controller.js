async function logout_controller(request, reply) {
  reply
    .clearCookie('jwt', {
      path: '/', 
      httpOnly: true,
      sameSite: 'lax',
      secure: true // ✅ HTTPS obrigatório para produção
    })
    .code(200)
    .send({ message: 'Logout realizado com sucesso.' });
}

module.exports = { logout_controller };
