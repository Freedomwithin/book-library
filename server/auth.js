require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const { ApolloServer } = require('apollo-server-express');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/lib/use/ws');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const { context, initializeDb } = require('../auth');  // Adjusted import path

async function startApolloServer() {
  await initializeDb(); // Initialize database connection
  const app = express();
  const httpServer = createServer(app);

  const schema = makeExecutableSchema({ typeDefs, resolvers });

  const server = new ApolloServer({
    schema,
    context: async ({ req }) => {
      const ctx = await context({ req });
      console.log('Apollo Server context:', ctx); // Add this line for debugging
      return ctx;
    },
    introspection: true,
    playground: true,
  });

  await server.start();
  server.applyMiddleware({ app });

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });

  useServer({ schema }, wsServer);

  const PORT = process.env.PORT || 4000;
  httpServer.listen(PORT, () => {
    console.log(`Server is now running on http://localhost:${PORT}${server.graphqlPath}`);
    console.log(`WebSocket server is now running on ws://localhost:${PORT}${server.graphqlPath}`);
  });
}

startApolloServer().catch(error => {
  console.error('Failed to start the server:', error);
});