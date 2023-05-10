const bcrypt = require("bcrypt");
const { DataTypes } = require("sequelize");

const sequelize = require("./connection");

const User = sequelize.define(
  "users",
  {
    uid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,

      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        typeValidator: (value) => {
          const enums = ["Admin", "User"];
          if (!enums.includes(value)) {
            throw new Error("Not a valid User type");
          }
        },
      },
    },
    created_on: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    hooks: {
      beforeCreate: async (user) => {
        if (user.password) {
          const salt = await bcrypt.genSaltSync(10, "a");
          user.password = bcrypt.hashSync(user.password, salt);
        }
      },
    },
    timestamps: false,
  }
);
sequelize
  .sync({ alter: true, force: false })
  .then(() => console.log("All Tables Created Successfully"));
// User.sync().then(() => console.log("Table Users Created"));

module.exports = User;
