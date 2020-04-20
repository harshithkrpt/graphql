const bcrypt = require("bcryptjs");

const { formatErrors } = require("../utils/errors");
const { tryLogin } = require("../utils/auth");

module.exports = {
  Query: {
    getUser: (parent, args, { models }) =>
      models.User.findOne({ where: { id: args.id } }),
    allUsers: (parent, args, { models }) => models.User.findAll(),
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
