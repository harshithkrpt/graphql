const { formatErrors } = require("../utils/errors");
const { requiresAuth } = require("../permissions");
const { Op } = require("sequelize");

module.exports = {
  Mutation: {
    getOrCreateChannel: requiresAuth.createResolver(
      async (_, { teamId, members }, { models, user }) => {
        const member = await models.Member.findOne(
          { where: { userId: user.id, teamId } },
          { raw: true }
        );

        if (!member) {
          throw new Error("Not Authorized");
        }
        const allMembers = [...members, user.id];
        // Check For Direct Message Channel
        const [data, result] = await models.sequelize.query(
          `
        select c.id,c.name
        from channels as c, pcmembers pc 
        where pc.channel_id = c.id and c.dm = true and c.public = false and c.team_id = ${teamId}
        group by c.id,c.name
        having array_agg(pc.user_id) @> Array[${allMembers.join(
          ","
        )}] and count(pc.user_id) = ${allMembers.length};
        `,
          { raw: true }
        );

        if (data.length) {
          return data[0];
        }

        const users = await models.User.findAll({
          raw: true,
          where: {
            id: {
              [Op.in]: members,
            },
          },
        });

        const name = users.map((u) => u.username).join(",");

        // Create Channel
        const channelId = await models.sequelize.transaction(
          async (transaction) => {
            const channel = await models.Channel.create(
              {
                name,
                public: false,
                dm: true,
                teamId,
              },
              { transaction }
            );

            const cId = channel.dataValues.id;
            const pcmembers = allMembers.map((m) => ({
              userId: m,
              channelId: cId,
            }));
            await models.PCMember.bulkCreate(pcmembers, { transaction });
            return cId;
          }
        );

        return {
          id: channelId,
          name,
        };
      }
    ),
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

          const res = await models.sequelize.transaction(
            async (transaction) => {
              const channel = await models.Channel.create(args, {
                transaction,
              });
              console.log(args, channel.dataValues);
              if (!args.public) {
                const members = args.members.filter((m) => m !== user.id);
                members.push(user.id);
                await models.PCMember.bulkCreate(
                  members.map((m) => ({
                    userId: m,
                    channelId: channel.dataValues.id,
                  })),
                  {
                    transaction,
                  }
                );
              }
              return channel;
            }
          );

          return {
            ok: true,
            channel: res,
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
