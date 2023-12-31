const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { typeDefs } = require("./schema/type-defs");
const { resolvers } = require("./schema/resolvers");
const mongoose = require("mongoose");
const cors = require("cors");
const { graphqlUploadExpress } = require("graphql-upload");

async function startServer() {
  const app = express();

  app.use(cors());
  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));

  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  server.applyMiddleware({ app });

  app.use(express.static("public"));

  app.get("/friends", (req, res) => {
    res.send("friends list");
  });

  await mongoose.connect("mongodb://localhost:27017/swd_db");
  console.log("mongoose connected");

  app.listen(4000, () => {
    console.log("Server is running on port 4000");
  });
}

startServer();
