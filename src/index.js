import { ApolloServer } from "apollo-server-express";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { applyMiddleware } from "graphql-middleware";
import express from "express";
import expressJwt from "express-jwt";

import permission from "./permission";
import resolvers from "./resolvers";
import typeDefs from "./typeDefs";

const port = 4000;

const app = express();

app.use(
  expressJwt({
    secret: "SUPER_SECRET",
    algorithms: ["HS256"],
    credentialsRequired: false,
  })
);

(async () => {
  const server = new ApolloServer({
    schema: applyMiddleware(
      makeExecutableSchema({ typeDefs, resolvers }),
      permission
    ),
    context: ({ req }) => {
      const user = req.user || null;
      return { user };
    },
  });

  await server.start();
  server.applyMiddleware({ app });
})();

app.listen({ port }, () =>
  console.log(`Sever ready at http://localhost:${port}/graphql`)
);
