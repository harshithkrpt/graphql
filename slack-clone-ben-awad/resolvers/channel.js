module.exports = {
  Mutation: {
    createChannel: async (_, args, { models }) => {
      try {
        await models.Channel.create(args);
        return true;
      } catch (e) {
        console.log(e);
        return false;
      }
    },
  },
};
