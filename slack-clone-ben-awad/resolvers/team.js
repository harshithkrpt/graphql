const { formatErrors } = require("../utils/errors");
const { requiresAuth } = require("../permissions");

module.exports = {
  Query: {
    allTeams: requiresAuth.createResolver(async (_, args, { models, user }) => {
      return models.Team.findAll({ where: { owner: user.id } }, { raw: true });
    }),
  },
  Mutation: {
    createTeam: requiresAuth.createResolver(
      async (_, args, { models, user }) => {
        try {
          const team = await models.Team.create({ ...args, owner: user.id });
          await models.Channel.create({
            name: "general",
            public: true,
            teamId: team.id,
          });
          return {
            ok: true,
            team,
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
  Team: {
    channels: ({ id }, args, { models }) =>
      models.Channel.findAll({ where: { teamId: id } }),
  },
};
