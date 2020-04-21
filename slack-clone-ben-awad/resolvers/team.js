const { formatErrors } = require("../utils/errors");
const { requiresAuth } = require("../permissions");

module.exports = {
  Mutation: {
    createTeam: requiresAuth.createResolver(
      async (_, args, { models, user }) => {
        try {
          // Doing A Transaction
          const response = await models.sequelize.transaction(async () => {
            const team = await models.Team.create({ ...args });
            await models.Channel.create({
              name: "general",
              public: true,
              teamId: team.id,
            });
            await models.Member.create({
              teamId: team.id,
              userId: user.id,
              admin: true,
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
          const memberPromise = models.Member.findOne(
            { where: { teamId, userId: user.id } },
            { raw: true }
          );
          const userToAddPromise = models.User.findOne(
            { where: { email } },
            { raw: true }
          );
          const [member, userToAdd] = await Promise.all([
            memberPromise,
            userToAddPromise,
          ]);
          if (!member.admin) {
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
