const { requiresAuth } = require("../permissions");
const { PubSub, withFilter } = require("graphql-subscriptions");

const pubsub = new PubSub();

const NEW_CHANNEL_MESSAGE = "NEW_CHANNEL_MESSAGE";

module.exports = {
  Subscription: {
    newChannelMessage: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(NEW_CHANNEL_MESSAGE),
        (payload, args) => payload.channelId === args.channelId
      ),
    },
  },
  Message: {
    user: async ({ user, userId }, args, { models }) => {
      if (user) return user;

      return await models.User.findOne({ where: { id: userId } });
    },
  },
  Query: {
    messages: requiresAuth.createResolver(
      async (_, { channelId }, { models, user }) => {
        return models.Message.findAll(
          { order: [["createdAt", "ASC"]], where: { channelId } },
          { raw: true }
        );
      }
    ),
  },
  Mutation: {
    createMessage: requiresAuth.createResolver(
      async (_, args, { models, user }) => {
        try {
          const message = await models.Message.create({
            ...args,
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
