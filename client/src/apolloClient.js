import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Create the http link
const httpLink = createHttpLink({
  uri: 'http://localhost:4000/graphql', // Replace with your GraphQL server URL
});

// Create the auth link
const authLink = setContext((_, { headers }) => {
  // Get the authentication token from local storage if it exists
  const token = localStorage.getItem('bookLibraryToken');
  // Return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

// Create the Apollo Client instance
const client = new ApolloClient({
  link: authLink.concat(httpLink), // Combine the auth link and http link
  cache: new InMemoryCache()
});

export default client;