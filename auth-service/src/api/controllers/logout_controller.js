async function logout_controller(request, reply) {
  reply
    .clearCookie('jwt', {
      path: '/', 
      httpOnly: true,
      sameSite: 'lax',
      secure: false // true se usar HTTPS
    })
    .code(200)
    .send({ message: 'Logout realizado com sucesso.' });
}

module.exports = { logout_controller };
