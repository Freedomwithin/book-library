const { MongoClient } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME = 'book-library';

let db = null;

async function connectToDatabase() {
  if (db) return db;

  try {
    const client = new MongoClient(MONGODB_URI, {
      useNewUrlParser: true,
    });

    await client.connect();
    console.log('Connected to MongoDB');

    db = client.db(DB_NAME);
    return db;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
  }
}

function getDb() {
  if (!db) {
    throw new Error('Database not initialized. Call connectToDatabase first.');
  }
  return db;
}

module.exports = {
  connectToDatabase,
  getDb,
};
