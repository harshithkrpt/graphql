const { formatErrors } = require("../utils/errors");
const { requiresAuth } = require("../permissions");

module.exports = {
  Query: {
    allTeams: requiresAuth.createResolver(async (_, __, { models, user }) => {
      return models.Team.findAll({ where: { owner: user.id } }, { raw: true });
    }),
    // inviteTeams: requiresAuth.createResolver(async (_, __, { models, user }) =>
    //   models.Team.findAll(
    //     {
    //       include: [
    //         {
    //           model: models.User,
    //           where: { id: user.id },
    //         },
    //       ],
    //     },
    //     { raw: true }
    //   )
    // ),
    inviteTeams: requiresAuth.createResolver(
      async (_, __, { models, user }) => {
        return models.sequelize.query(
          "SELECT * FROM teams join members on id = team_id where user_id = ?",
          {
            replacements: [user.id],
            model: models.Team,
          }
        );
      }
    ),
  },
  Mutation: {
    createTeam: requiresAuth.createResolver(
      async (_, args, { models, user }) => {
        try {
          // Doing A Transaction
          const response = await models.sequelize.transaction(async () => {
            const team = await models.Team.create({ ...args, owner: user.id });
            await models.Channel.create({
              name: "general",
              public: true,
              teamId: team.id,
            });
            return team;
          });

          return {
            ok: true,
            team: response,
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
    addTeamMember: requiresAuth.createResolver(
      async (_, { email, teamId }, { models, user }) => {
        try {
          const teamPromise = models.Team.findOne(
            { where: { id: teamId } },
            { raw: true }
          );
          const userToAddPromise = models.User.findOne(
            { where: { email } },
            { raw: true }
          );
          const [team, userToAdd] = await Promise.all([
            teamPromise,
            userToAddPromise,
          ]);
          if (team.owner !== user.id) {
            return {
              ok: false,
              errors: [
                {
                  path: "email",
                  message: "you cannot add members to the team",
                },
              ],
            };
          }
          if (!userToAdd) {
            return {
              ok: false,
              errors: [
                {
                  path: "email",
                  message: "Could not find user with this email",
                },
              ],
            };
          }

          await models.Member.create({ userId: userToAdd.id, teamId });
          return {
            ok: true,
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
