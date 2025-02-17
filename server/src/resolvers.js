const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { ObjectId } = require('mongodb');
const { AuthenticationError } = require('apollo-server-express');

const resolvers = {
  Query: {
    books: async (_, __, { db }) => {
      if (!db) throw new Error('Database connection not available');
      try {
        const books = await db.collection('books').find().toArray();
        return books || [];
      } catch (error) {
        console.error("Error fetching books:", error);
        return [];
      }
    },
    book: async (_, { id }, { db }) => {
      if (!db) throw new Error('Database connection not available');
      try {
        const book = await db.collection('books').findOne({ _id: new ObjectId(id) });
        if (!book) throw new Error('Book not found');
        return book;
      } catch (error) {
        console.error("Error fetching book:", error);
        throw new Error(error.message || "Failed to fetch book");
      }
    },
    me: async (_, __, { user, db }) => {
      if (!db) throw new Error('Database connection not available');
      if (!user) {
        throw new AuthenticationError('Not authenticated');
      }
      try {
        const dbUser = await db.collection('users').findOne({ _id: new ObjectId(user.userId) });
        if (!dbUser) {
          throw new Error('User not found');
        }
        return {
          id: dbUser._id.toString(),
          username: dbUser.username
        };
      } catch (error) {
        console.error("Error fetching user:", error);
        throw new Error(error.message || "Failed to fetch user");
      }
    },
  },
  Mutation: {
    addBook: async (_, { title, author }, { db, user }) => {
      if (!db) throw new Error('Database connection not available');
      if (!user) throw new Error('You must be logged in to add a book');
      try {
        const newBook = { title, author };
        console.log('Attempting to insert book:', newBook);
        const result = await db.collection('books').insertOne(newBook);
        console.log('Insert result:', result);
        if (!result.insertedId) {
          throw new Error('Failed to insert book: No ID returned');
        }
        const insertedId = result.insertedId.toString();
        console.log('Inserted ID:', insertedId);
        const returnBook = {
          id: insertedId,
          title,
          author
        };
        console.log('Returning book:', returnBook);
        return returnBook;
      } catch (error) {
        console.error("Error adding book:", error);
        throw new Error(error.message || "Failed to add book");
      }
    },
    updateBook: async (_, { id, title, author }, { db, user }) => {
      if (!db) throw new Error('Database connection not available');
      if (!user) throw new Error('You must be logged in to update a book');
      try {
        const result = await db.collection('books').findOneAndUpdate(
          { _id: new ObjectId(id) },
          { $set: { title, author } },
          { returnDocument: 'after' }
        );
        if (!result.value) throw new Error('Book not found');
        return { ...result.value, id: result.value._id.toString() };
      } catch (error) {
        console.error("Error updating book:", error);
        throw new Error(error.message || "Failed to update book");
      }
    },
    deleteBook: async (_, { id }, { db, user }) => {
      if (!db) throw new Error('Database connection not available');
      if (!user) throw new Error('You must be logged in to delete a book');
      try {
        const result = await db.collection('books').deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) throw new Error('Book not found');
        return true;
      } catch (error) {
        console.error("Error deleting book:", error);
        throw new Error(error.message || "Failed to delete book");
      }
    },
    signup: async (_, { username, password }, { db }) => {
      if (!db) throw new Error('Database connection not available');
      try {
        const existingUser = await db.collection('users').findOne({ username });
        if (existingUser) {
          throw new Error('Username already exists');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await db.collection('users').insertOne({
          username,
          password: hashedPassword,
        });

        const token = jwt.sign(
          { userId: result.insertedId.toString() },
          process.env.JWT_SECRET,
          { expiresIn: '1d' }
        );

        return {
          token,
          user: {
            id: result.insertedId.toString(),
            username,
          },
        };
      } catch (error) {
        console.error("Error during signup:", error);
        throw new Error(error.message || "Failed to sign up");
      }
    },
    login: async (_, { username, password }, { db }) => {
      if (!db) throw new Error('Database connection not available');
      try {
        const user = await db.collection('users').findOne({ username });
        if (!user) {
          throw new Error('Invalid username or password');
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          throw new Error('Invalid username or password');
        }

        const token = jwt.sign(
          { userId: user._id.toString() },
          process.env.JWT_SECRET,
          { expiresIn: '1d' }
        );

        return {
          token,
          user: {
            id: user._id.toString(),
            username: user.username,
          },
        };
      } catch (error) {
        console.error("Error during login:", error);
        throw new Error(error.message || "Failed to log in");
      }
    },
  },
};

module.exports = resolvers;