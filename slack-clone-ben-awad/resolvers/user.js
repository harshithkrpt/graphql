const bcrypt = require("bcryptjs");

const { formatErrors } = require("../utils/errors");
const { tryLogin } = require("../utils/auth");
const { requiresAuth } = require("../permissions");

module.exports = {
  User: {
    teams: (parent, args, { models, user }) => {
      return models.sequelize.query(
        "SELECT * FROM teams as team join members as member on team.id = member.team_id where member.user_id = ?",
        {
          replacements: [user.id],
          model: models.Team,
          raw: true,
        }
      );
    },
  },
  Query: {
    allUsers: (parent, args, { models }) => models.User.findAll(),
    me: requiresAuth.createResolver(async (parent, args, { models, user }) => {
      return await models.User.findOne({ where: { id: user.id } });
    }),
  },
  Mutation: {
    register: async (_, args, { models }) => {
      try {
        const user = await models.User.create(args);

        return {
          ok: true,
          user,
        };
      } catch (e) {
        return {
          ok: false,
          errors: formatErrors(e, models),
        };
      }
    },
    login: (_, { email, password }, { models, SECRET, SECRET2 }) =>
      tryLogin(email, password, models, SECRET, SECRET2),
  },
};
