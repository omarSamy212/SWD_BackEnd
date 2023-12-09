const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const mongoose = require("mongoose");
const cors = require("cors");
const { graphqlUploadExpress } = require("graphql-upload");
require("dotenv").config(); // Load environment variables from .env file

const { typeDefs } = require("./schema/type-defs");
const { resolvers } = require("./schema/resolvers");

async function startServer() {
  const app = express();

  const server = new ApolloServer({ typeDefs, resolvers });
  await server.start();
  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));
  server.applyMiddleware({ app });

  app.use(express.static("public"));
  app.use(cors());

  // Update the MongoDB connection code
  const mongoURI = process.env.MONGODB_URI;

  mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  mongoose.connection.once("open", () => {
    console.log("mongoose connected");
  });

  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err);
  });

  app.listen(4000, () => {
    console.log("Server is running on port 4000");
  });
}

startServer();
