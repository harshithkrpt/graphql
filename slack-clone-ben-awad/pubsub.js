const { RedisPubSub } = require("graphql-redis-subscriptions");

const pubsub = new RedisPubSub({
  connection: {
    host: "127.0.0.1",
    port: 6379,
    retryStrategy: (times) => {
      // reconnect after
      return Math.min(times * 50, 2000);
    },
  },
});

module.exports = pubsub;
