const { formatErrors } = require("../utils/errors");
const { requiresAuth } = require("../permissions");

module.exports = {
  Mutation: {
    createChannel: requiresAuth.createResolver(
      async (_, args, { models, user }) => {
        try {
          const team = await models.Team.findOne(
            { where: { id: args.teamId } },
            { raw: true }
          );
          if (team.owner !== user.id) {
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
