require('dotenv').config();
const express = require('express');
const { createServer } = require('http');
const { ApolloServer } = require('apollo-server-express');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { WebSocketServer } = require('ws');
const { useServer } = require('graphql-ws/lib/use/ws');
const { MongoClient } = require('mongodb');
const jwt = require('jsonwebtoken');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://jonathonkoerner:Freedomwith@book-library.d8din.mongodb.net/book-library?retryWrites=true&w=majority';
const DB_NAME = 'book-library';
const JWT_SECRET = process.env.JWT_SECRET || 'Freedomwith';

// Helper function to verify JWT token
const getUser = (token) => {
  if (token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (err) {
      console.error('Error verifying token:', err);
      return null;
    }
  }
  return null;
};

async function startApolloServer() {
  const app = express();
  const httpServer = createServer(app);

  // Connect to MongoDB
  let client;
  try {
    client = new MongoClient(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    console.log('Connected to MongoDB');
    const db = client.db(DB_NAME);

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

    const PORT = process.env.PORT || 4000;
    httpServer.listen(PORT, () => {
      console.log(`Server is now running on http://localhost:${PORT}${server.graphqlPath}`);
      console.log(`WebSocket server is now running on ws://localhost:${PORT}${server.graphqlPath}`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

startApolloServer().catch(error => {
  console.error('Failed to start the server:', error);
});