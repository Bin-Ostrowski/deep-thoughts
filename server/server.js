const path = require("path");

const express = require("express");
//import ApolloServer
const { ApolloServer } = require("apollo-server-express");

//import typeDefs and resolvers
const { typeDefs, resolvers } = require("./schemas");

//import server connection
const db = require("./config/connection");

//import Authentication middleware
const { authMiddleware } = require("./utils/auth");

const PORT = process.env.PORT || 3001;
//create new Apollo server and pass in schema data and auth middleware
// ensures every request performs an authentication check,
// and updated request object is passed to the resolvers as context.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: authMiddleware,
});

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// create new instance of Apollo server with GraphQL schema
const startApolloServer = async (typeDefs, resolvers) => {
  await server.start();
  //integrate Apollo server with Express application as middleware
  server.applyMiddleware({ app });

  //when we go into production
  // Serve up static assets
  //check to see if Node environment is in production. If yes, we instruct Express.js 
  //server to serve any files in the React application's build directory in the 
  //client folder.
  if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../client/build")));
  }

  //if a GET request to any location on the server that doesn't have an explicit route
  // defined, respond with the production-ready React front-end code.
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/build/index.html"));
  });

  //run server - listen for connection with db.open(). Upon connection,
  // start the server.
  db.once("open", () => {
    app.listen(PORT, () => {
      console.log(`API server running on port ${PORT}!`);
      // log where we can go to test our GQL API
      console.log(
        `Use GraphQL at http://localhost:${PORT}${server.graphqlPath}`
      );
    });
  });
};

// call async function to start the server
startApolloServer(typeDefs, resolvers);
