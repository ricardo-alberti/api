const express = require('express');
const { ApolloServer } = require('apollo-server-express');
require('dotenv').config();

//Local modules imports
const jwt = require('jsonwebtoken');
const db = require('./db');
const models = require('./models');
const typeDefs = require ('./schema');
const resolvers = require('./resolvers');

// Run our server on a port specified in our .env file or port 4000
const port = process.env.PORT || 4000;
const DB_HOST = process.env.DB_HOST;

const app = express();

db.connect(DB_HOST);

// get user info drom a JWT
const getUser = token => {
  if(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      throw new Error('Session invalid');
    }
  }
};

// Apollo Server setup
const server = new ApolloServer({ 
  typeDefs, 
  resolvers,
  context: ({ req }) => {

    const token = req.headers.authorization;
    const user = getUser(token);
    console.log(user);

    return { models, user };
  }
});

// Apply the Apollo GraphQL middleware and set the path to /api
server.applyMiddleware({ app, path: '/api' });

app.listen({ port }, () =>
  console.log(
    `GraphQL Server running at http://localhost:${port}${server.graphqlPath}`
  )
);
