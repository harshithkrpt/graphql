const { requiresAuth, requiresTeamAccess } = require("../permissions");
const { withFilter } = require("graphql-subscriptions");

const pubsub = require("../pubsub");

const NEW_CHANNEL_MESSAGE = "NEW_CHANNEL_MESSAGE";

module.exports = {
  Subscription: {
    newChannelMessage: {
      subscribe: requiresTeamAccess.createResolver(
        withFilter(
          () => pubsub.asyncIterator(NEW_CHANNEL_MESSAGE),
          (payload, args) => payload.channelId === args.channelId
        )
      ),
    },
  },
  Message: {
    url: (parent, __, { serverUrl }) =>
      parent.url ? `${serverUrl}/${parent.url}` : parent.url,
    user: async ({ user, userId }, args, { models }) => {
      if (user) return user;

      return models.User.findOne({ where: { id: userId } }, { raw: true });
    },
  },
  Query: {
    messages: requiresAuth.createResolver(
      async (_, { channelId, offset }, { models, user }) => {
        const channel = await models.Channel.findOne(
          { where: { id: channelId } },
          { raw: true }
        );
        if (!channel.public) {
          const member = await models.PCMember.findOne({
            where: { channelId: channelId, userId: user.id },
          });

          if (!member) {
            throw new Error("Not Authorized");
          }
        }
        return models.Message.findAll(
          {
            order: [["createdAt", "DESC"]],
            where: { channelId },
            limit: 35,
            offset,
          },
          { raw: true }
        );
      }
    ),
  },
  Mutation: {
    createMessage: requiresAuth.createResolver(
      async (_, { file, ...args }, { models, user }) => {
        try {
          const messageData = args;
          if (file) {
            messageData.filetype = file.type;
            messageData.url = file.path;
          }
          const message = await models.Message.create({
            ...messageData,
            userId: user.id,
          });
          const asyncFunc = async () => {
            const currentUser = await models.User.findOne(
              {
                where: {
                  id: user.id,
                },
              },
              { raw: true }
            );

            pubsub.publish(NEW_CHANNEL_MESSAGE, {
              channelId: args.channelId,
              newChannelMessage: {
                ...message.dataValues,
                user: currentUser.dataValues,
              },
            });
          };
          asyncFunc();
          return true;
        } catch (e) {
          console.log(e);
          return false;
        }
      }
    ),
  },
};
