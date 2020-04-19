const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const {
  fileLoader,
  mergeTypes,
  mergeResolvers,
} = require("merge-graphql-schemas");
const { ApolloServer } = require("apollo-server-express");

const models = require("./models");

const app = express();

app.use(cors({ origin: "http://localhost:3000" }));
app.use(bodyParser.json());

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, "./schema")), {
  all: true,
});

const resolvers = mergeResolvers(
  fileLoader(path.join(__dirname, "./resolvers"))
);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    models,
    user: {
      id: 1,
    },
  },
});

server.applyMiddleware({ app, cors: false });

models.sequelize.sync().then(() => {
  app.listen(8080, () => {
    console.log("Server Started on 8080");
  });
});
