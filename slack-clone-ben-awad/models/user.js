const bcrypt = require("bcryptjs");

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "user",
    {
      username: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          len: {
            args: [3, 25],
            msg: "username needs to be between 3 and 25 characters long",
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          isEmail: {
            args: true,
            msg: "Invalid Email",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        validate: {
          len: {
            args: [5, 100],
            msg: "Password must be between 5 and 100",
          },
        },
      },
    },
    {
      timestamps: false,
      hooks: {
        afterValidate: async (user) => {
          user.password = await bcrypt.hash(user.password, 12);
        },
      },
    }
  );

  User.associate = (models) => {
    User.belongsToMany(models.Team, {
      through: "member",
      foreignKey: {
        name: "userId",
        field: "user_id",
      },
    });
    // N : M
    User.belongsToMany(models.Channel, {
      through: "channel_member",
      foreignKey: {
        name: "userId",
        field: "user_id",
      },
    });

    User.belongsToMany(models.Channel, {
      through: models.PCMember,
      foreignKey: {
        name: "userId",
        field: "user_id",
      },
    });
  };

  return User;
};
