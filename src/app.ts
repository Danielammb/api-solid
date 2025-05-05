import fastify from "fastify";
import { z } from "zod";
import { env } from "./env";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";
import { gymsRoutes } from "./http/controllers/gyms/routes";
import { usersRoutes } from "./http/controllers/users/routes";
import { checkInsRoutes } from "./http/controllers/check-ins.ts/routes";

export const app = fastify();

app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  cookie: { cookieName: "refreshToken", signed: false },
  sign: {
    expiresIn: "10m", // a cada 10 minutos chegará um novo token
  },
});

app.register(fastifyCookie);

app.register(usersRoutes);
app.register(gymsRoutes);
app.register(checkInsRoutes);

app.setErrorHandler((error, _, reply) => {
  if (error instanceof z.ZodError) {
    reply
      .status(400)
      .send({ message: "Validation error", issues: error.format() });
    return;
  }

  if (env.NODE_ENV === "dev") {
    console.error(error);
  } else {
    //here we should log the error to a log management service
  }

  reply.status(500).send({ message: "Internal server error" });
});
