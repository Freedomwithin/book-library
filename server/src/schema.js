const { gql } = require('apollo-server');

const typeDefs = gql`
  type Book {
    id: ID!
    title: String!
    author: String!
  }

  type User {
    id: ID!
    username: String!
  }

  type Query {
    books: [Book!]!
    book(id: ID!): Book
    me: User
  }

  type Mutation {
    addBook(title: String!, author: String!): Book!
    updateBook(id: ID!, title: String, author: String): Book
    deleteBook(id: ID!): Boolean!
    signup(username: String!, password: String!): AuthPayload
    login(username: String!, password: String!): AuthPayload
    logout: Boolean!
  }

  type AuthPayload {
    token: String!
    user: User
  }

  # Subscription type is commented out until implemented in resolvers
  # type Subscription {
  #   bookAdded: Book
  # }
`;

module.exports = typeDefs;