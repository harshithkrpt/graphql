const { formatErrors } = require("../utils/errors");
const { requiresAuth } = require("../permissions");

module.exports = {
  Mutation: {
    createChannel: requiresAuth.createResolver(
      async (_, args, { models, user }) => {
        try {
          const member = await models.Member.findOne(
            { where: { userId: user.id, teamId: args.teamId } },
            { raw: true }
          );
          if (!member.admin) {
            return {
              ok: false,
              errors: [
                {
                  path: "name",
                  message: "you are not the owner of the team",
                },
              ],
            };
          }
          const channel = await models.Channel.create(args);
          return {
            ok: true,
            channel,
          };
        } catch (e) {
          console.log(e);
          return {
            ok: false,
            errors: formatErrors(e, models),
          };
        }
      }
    ),
  },
};
