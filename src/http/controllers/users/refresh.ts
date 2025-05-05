import { FastifyRequest, FastifyReply } from "fastify";

export const refresh = async (request: FastifyRequest, reply: FastifyReply) => {
  await request.jwtVerify({ onlyCookie: true });
  // Verifica se o token JWT é válido e se o cookie "refreshToken" está presente
  // Se o token não for válido, o Fastify irá automaticamente retornar um erro 401
  const { role } = request.user;
  const token = await reply.jwtSign(
    { role: role },
    { sign: { sub: request.user.sub } }
  );
  const refreshToken = await reply.jwtSign(
    { role: role },
    { sign: { sub: request.user.sub, expiresIn: "7d" } }
  );

  return reply
    .setCookie("refreshToken", refreshToken, {
      path: "/",
      secure: true, //proteção ao utilizar HTTPS
      sameSite: true, //proteção contra CSRF
      httpOnly: true, //protegendo o cookie contra ataques XSS
    })
    .status(200)
    .send({ token });
};
