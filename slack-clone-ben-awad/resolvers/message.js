module.exports = {
  Mutation: {
    createMessage: async (_, args, { models, user }) => {
      try {
        await models.Message.create({ ...args, userId: user.id });
        return true;
      } catch (e) {
        console.log(e);
        return false;
      }
    },
  },
};
