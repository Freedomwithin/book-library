import { gql } from '@apollo/client';

export const GET_BOOKS = gql`
  query GetBooks {
    books {
      id
      title
      author
    }
  }
`;

export const ADD_BOOK = gql`
  mutation AddBook($title: String!, $author: String!) {
    addBook(title: $title, author: $author) {
      id
      title
      author
    }
  }
`;

export const LOGIN = gql`
  mutation Login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      token
      user {
        id
        username
      }
    }
  }
`;

export const SIGNUP = gql`
  mutation Signup($username: String!, $password: String!) {
    signup(username: $username, password: $password) {
      token
      user {
        id
        username
      }
    }
  }
`;
export const GET_ME = gql`
  query GetMe {
    me {
      id
      username
    }
  }
`;
export const REMOVE_BOOK = gql`
  mutation RemoveBook($id: ID!) {
    deleteBook(id: $id)
  }
`;

// Remove the duplicate GET_BOOKS declaration
// export const GET_BOOKS = gql`
//   query GetBooks {
//     books {
//       id
//       title
//       author
//     }
//   }
// `;