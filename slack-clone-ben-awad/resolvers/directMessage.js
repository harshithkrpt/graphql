const { requiresAuth, requiresTeamAccess } = require("../permissions");

module.exports = {
  //   Subscription: {
  //     newChannelMessage: {
  //       subscribe: requiresTeamAccess.createResolver(
  //         withFilter(
  //           () => pubsub.asyncIterator(NEW_CHANNEL_MESSAGE),
  //           (payload, args) => payload.channelId === args.channelId
  //         )
  //       ),
  //     },
  //   },
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
          //   const asyncFunc = async () => {
          //     const currentUser = await models.User.findOne(
          //       {
          //         where: {
          //           id: user.id,
          //         },
          //       },
          //       { raw: true }
          //     );

          //     pubsub.publish(NEW_CHANNEL_MESSAGE, {
          //       channelId: args.channelId,
          //       newChannelMessage: {
          //         ...message.dataValues,
          //         user: currentUser.dataValues,
          //       },
          //     });
          //   };
          //   asyncFunc();
          return true;
        } catch (e) {
          console.log(e);
          return false;
        }
      }
    ),
  },
};
