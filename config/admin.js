const { DataTypes } = require("sequelize");
const sequelize = require("./connection");
const Admin = sequelize.define(
  "Admin",
  {
    rid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,

      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contactNumber: {
      type: DataTypes.TEXT,

      unique: true,
      validate: {
        validator: function (v) {
          if (v !== "") {
            const regex = /\+\d{1,3}\d{10}/.test(v);
            if (!regex) {
              throw new Error("Phone number is invalid");
            } else return true;
          }
        },
      },
    },

    bio: {
      type: DataTypes.TEXT,
    },
  },
  {
    timestamps: false,
    freezeTableName: true,
  }
);
sequelize
  .sync({ alter: true, force: false })
  .then(() => console.log("All Tables Created Successfully"));
// Admin.sync().then(() => console.log("Table Admin Created"));

module.exports = Admin;
