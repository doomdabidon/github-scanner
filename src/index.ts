import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { typeDefs } from './typeDefs';
import { resolvers } from './resolvers';
import { validateToken } from './utils/validator';

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });
  
  const { url } = await startStandaloneServer(server, {
    context: async ({ req }) => {
      const token = req.headers.authorization || '';
      const query = (req as any)?.body?.query;
      
      const isIntrospection = query.includes('__schema');

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
