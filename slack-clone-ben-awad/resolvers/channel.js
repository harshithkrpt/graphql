const { formatErrors } = require("../utils/errors");

module.exports = {
  Mutation: {
    createChannel: async (_, args, { models }) => {
      try {
        const channel = await models.Channel.create(args);
        return {
          ok: true,
          channel,
        };
      } catch (e) {
        console.log(e);
        return {
          ok: false,
          errors: formatErrors(e),
        };
      }
    },
  },
};
