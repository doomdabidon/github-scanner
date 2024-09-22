import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

import { typeDefs } from './graphql/typeDefs';
import { resolvers } from './graphql/resolvers';
import { validateToken } from './utils';
import { QUERY_SCHEMA_REQUEST_PART } from './constants';

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  
  const { url } = await startStandaloneServer(server, {
    context: async ({ req }) => {
      const token = req.headers.authorization || '';
      const query = (req as any)?.body?.query;
      
      const isIntrospection = query.includes(QUERY_SCHEMA_REQUEST_PART);

      if (isIntrospection) {
        return {};
      }

      validateToken(token);

      return {
        token,
      };
    },
    listen: { port: 4000 },
  });

  console.log(`Server is lissening at ${url}`);
}

startServer();
