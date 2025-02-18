require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const { ApolloServer } = require('apollo-server-express');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/lib/use/ws');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const { connectToDatabase, getDb } = require('./db');
const { getUser } = require('./auth');

const PORT = process.env.PORT || 4000;

async function startApolloServer() {
  const app = express();
  const httpServer = createServer(app);

  try {
    // Connect to MongoDB
    await connectToDatabase();
    const db = getDb();

    const schema = makeExecutableSchema({ typeDefs, resolvers });

    const server = new ApolloServer({
      schema,
      context: async ({ req }) => {
        const token = req.headers.authorization || '';
        const user = getUser(token.replace('Bearer ', ''));
        return { db, user };
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

    useServer({ 
      schema,
      context: async (ctx) => {
        const token = ctx.connectionParams?.authorization || '';
        const user = getUser(token.replace('Bearer ', ''));
        return { db, user };
      }
    }, wsServer);

    httpServer.listen(PORT, () => {
      console.log(`Server is now running on http://localhost:${PORT}${server.graphqlPath}`);
      console.log(`WebSocket server is now running on ws://localhost:${PORT}${server.graphqlPath}`);
    });
  } catch (error) {
    console.error('Failed to start the server:', error);
    process.exit(1);
  }
}

startApolloServer().catch(error => {
  console.error('Failed to start the server:', error);
});