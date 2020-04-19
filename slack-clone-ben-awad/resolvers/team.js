module.exports = {
  Mutation: {
    createTeam: async (_, args, { models, user }) => {
      try {
        await models.Team.create({ ...args, owner: user.id });
        return true;
      } catch (e) {
        console.log(e);
      }
    },
  },
};
