async function logout_controller(request, reply) {
  request.server.metrics.activeSessions.dec();
  reply
    .clearCookie('jwt', {
      path: '/', 
      httpOnly: true,
      sameSite: 'lax',
      secure: true // use 'true' in production with HTTPS
    })
    .code(200)
    .send({ message: 'Logout realizado com sucesso.' });
}

module.exports = { logout_controller };
