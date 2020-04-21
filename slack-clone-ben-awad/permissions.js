const createResolver = (resolver) => {
  const baseResolver = resolver;
  baseResolver.createResolver = (childResolver) => {
    const newResolvers = async (parent, args, context, info) => {
      await resolver(parent, args, context, info);
      return childResolver(parent, args, context, info);
    };
    return createResolver(newResolvers);
  };
  return baseResolver;
};

const requiresAuth = createResolver((parent, args, { user }) => {
  if (!user || !user.id) {
    throw new Error("Not Authenticated");
  }
});

const requiresTeamAccess = createResolver(
  async (parent, { channelId }, { user, models }) => {
    if (!user || !user.id) {
      throw new Error("Not Authenticated");
    }
    // Check For Part Of The Team
    const channel = await models.Channel.findOne({
      where: { id: channelId },
    });
    const member = await models.Member.findOne({
      where: { teamId: channel.teamId, userId: user.id },
    });
    if (!member) {
      throw new Error(
        "You Have To Be a Member Of the Team to Subscribe to its Messages"
      );
    }
  }
);

module.exports = { requiresAuth, requiresTeamAccess };
