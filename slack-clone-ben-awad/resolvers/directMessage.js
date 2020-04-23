const { requiresAuth, directMessageSubscription } = require("../permissions");

const { withFilter } = require("graphql-subscriptions");

const NEW_DIRECT_MESSAGE = "NEW_DIRECT_MESSAGE";

const pubsub = require("../pubsub");

module.exports = {
  Subscription: {
    newDirectMessage: {
      subscribe: directMessageSubscription.createResolver(
        withFilter(
          () => pubsub.asyncIterator(NEW_DIRECT_MESSAGE),
          (payload, args, { user }) =>
            payload.teamId === args.teamId &&
            ((payload.senderId === user.id &&
              payload.receiverId === args.userId) ||
              (payload.senderId === args.userId &&
                payload.receiverId === user.id))
        )
      ),
    },
  },
  DirectMessage: {
    sender: async ({ sender, senderId }, args, { models }) => {
      if (sender) return sender;

      return await models.User.findOne({ where: { id: senderId } });
    },
  },
  Query: {
    directMessages: requiresAuth.createResolver(
      async (_, { teamId, otherUserId }, { models, user }) => {
        //   All The Messages Between Two Users
        return models.DirectMessage.findAll(
          {
            order: [["createdAt", "ASC"]],
            where: {
              teamId,
              [models.Sequelize.Op.or]: [
                {
                  [models.Sequelize.Op.and]: [
                    { receiverId: otherUserId },
                    { senderId: user.id },
                  ],
                },
                {
                  [models.Sequelize.Op.and]: [
                    { receiverId: user.id },
                    { senderId: otherUserId },
                  ],
                },
              ],
            },
          },
          { raw: true }
        );
      }
    ),
  },
  Mutation: {
    createDirectMessage: requiresAuth.createResolver(
      async (_, args, { models, user }) => {
        try {
          const directMessage = await models.DirectMessage.create({
            ...args,
            senderId: user.id,
          });

          pubsub.publish(NEW_DIRECT_MESSAGE, {
            teamId: args.teamId,
            senderId: user.id,
            receiverId: args.receiverId,
            newDirectMessage: {
              ...directMessage.dataValues,
              sender: {
                username: user.username,
              },
            },
          });

          return true;
        } catch (e) {
          console.log(e);
          return false;
        }
      }
    ),
  },
};
