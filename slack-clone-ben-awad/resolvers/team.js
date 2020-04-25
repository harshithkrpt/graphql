const { formatErrors } = require("../utils/errors");
const { requiresAuth } = require("../permissions");
const { Op } = require("sequelize");

module.exports = {
  Query: {
    getTeamMembers: requiresAuth.createResolver(
      async (_, { teamId }, { models }) => {
        return models.sequelize.query(
          "SELECT * FROM users as u join members as m on m.user_id = u.id where m.team_id = ?",
          {
            replacements: [teamId],
            model: models.Team,
            raw: true,
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
          const response = await models.sequelize.transaction(
            async (transaction) => {
              const team = await models.Team.create(
                { ...args },
                { transaction }
              );
              await models.Channel.create(
                {
                  name: "general",
                  public: true,
                  teamId: team.id,
                },
                { transaction }
              );
              await models.Member.create(
                {
                  teamId: team.id,
                  userId: user.id,
                  admin: true,
                },
                { transaction }
              );
              return team;
            }
          );

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
    channels: ({ id }, args, { channelLoader }) => channelLoader.load(id),
    directMessageMembers: ({ id }, args, { models, user }) => {
      return models.sequelize.query(
        "select distinct on (u.id) u.id, u.username from users as u join direct_messages as dm on (u.id = dm.sender_id) or (u.id = dm.receiver_id) where (:currentUserId = dm.sender_id or :currentUserId = dm.receiver_id) and dm.team_id = :teamId",
        {
          replacements: { currentUserId: user.id, teamId: id },
          model: models.Team,
          raw: true,
        }
      );
    },
  },
};
