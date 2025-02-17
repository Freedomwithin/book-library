# Book Library

Book Library is a full-stack web application that allows users to browse, add, and manage books. It's built with a modern tech stack, featuring a React frontend and a Node.js backend with GraphQL API.

## Tech Stack

### Frontend
- React
- Apollo Client
- Styled-components
- TypeScript

### Backend
- Node.js
- Express
- Apollo Server
- GraphQL
- MongoDB

### Authentication
- JSON Web Tokens (JWT)

## Project Structure

The project is divided into two main directories:

- `client/`: Contains the React frontend application
- `server/`: Contains the Node.js backend application

## Getting Started

### Prerequisites

- Node.js (v14 or later recommended)
- npm or yarn
- MongoDB

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/book-library.git
   cd book-library
2. Install dependencies for both client and server:
    ```bash
   cd client && npm install
   cd ../server && npm install
### Running the Application
1. Start the backend server:
    ```bash
    cd server
    npm start
The GraphQL server will be available at http://localhost:4000/graphql

2. In a new terminal, start the frontend development server:
    ```bash
     cd client
     npm start
The application will be available at http://localhost:3000

### Features
Browse a list of books
-Add new books to the library
-User authentication (signup and login)
-GraphQL API for efficient data fetching
### Development
-The client-side code is located in the client/src directory
-The server-side code is located in the server directory
-GraphQL schema is defined in server/schema.js
-GraphQL resolvers are defined in server/resolvers.js
### Testing
1. To run tests:
   ```bash
   npm test
2. Building for Production
To create a production build:
   ```bash
   cd client
   npm run build
This will create a build directory with a production build of the app.
### Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
### License
This project is licensed under the MIT License
