const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  "slack-clone-ben-awad",
  "postgres",
  "postgres",
  {
    host: "localhost",
    dialect: "postgres",
    define: {
      underscore: true,
    },
  }
);

const models = {
  User: sequelize.import("./user"),
  Channel: sequelize.import("./channel"),
  Message: sequelize.import("./message"),
  Team: sequelize.import("./team"),
  Member: sequelize.import("./member"),
};

// For Foreign Key Linkage
Object.keys(models).forEach((modelName) => {
  if ("associate" in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
