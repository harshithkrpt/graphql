const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const jwt = require("jsonwebtoken");
const {
  fileLoader,
  mergeTypes,
  mergeResolvers,
} = require("merge-graphql-schemas");
const { ApolloServer } = require("apollo-server-express");
const { refreshTokens } = require("./utils/auth");

const models = require("./models");

const app = express();

app.use(cors({ origin: "http://localhost:3000" }));
app.use(bodyParser.json());

const SECRET = "jaiodnbosdcaol-6wqyhauo";
const SECRET2 = "jsodogusabxzgfygsajhvz";

const addUser = async (req, res, next) => {
  const token = req.headers["x-token"];

  if (token) {
    try {
      const { user } = jwt.verify(token, SECRET);
      req.user = user;
    } catch (e) {
      const refreshToken = req.headers["x-refresh-token"];
      const newTokens = await refreshTokens(
        token,
        refreshToken,
        models,
        SECRET,
        SECRET2
      );
      if (newTokens.token && newTokens.refreshToken) {
        res.set("Access-Control-Expose-Headers", "x-token,x-refresh-token");
        res.set("x-token", newTokens.token);
        res.set("x-refresh-token", newTokens.refreshToken);
      }

      req.user = newTokens.user;
    }
  }
  next();
};

app.use(addUser);

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, "./schema")), {
  all: true,
});

const resolvers = mergeResolvers(
  fileLoader(path.join(__dirname, "./resolvers"))
);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => {
    return { models, user: req.user, SECRET, SECRET2 };
  },
});

server.applyMiddleware({ app, cors: false });

models.sequelize.sync().then(() => {
  app.listen(8080, () => {
    console.log("Server Started on 8080");
  });
});
