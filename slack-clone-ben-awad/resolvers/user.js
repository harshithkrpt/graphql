const bcrypt = require("bcryptjs");

const { formatErrors } = require("../utils/errors");

module.exports = {
  Query: {
    getUser: (parent, args, { models }) =>
      models.User.findOne({ where: { id: args.id } }),
    allUsers: (parent, args, { models }) => models.User.findAll(),
  },
  Mutation: {
    register: async (_, args, { models }) => {
      try {
        if (args.password.length < 5 || args.password.length > 100) {
          return {
            ok: false,
            errors: [
              {
                path: "password",
                message: "Password needs to be between 5 and 100",
              },
            ],
          };
        }

        const hashedPassword = await bcrypt.hash(args.password, 12);
        const user = await models.User.create({
          ...args,
          password: hashedPassword,
        });

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
  },
};
