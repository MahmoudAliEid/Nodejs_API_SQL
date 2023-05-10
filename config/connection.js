const Sequelize = require("sequelize");
const sequelize = new Sequelize("shope", "root", "", {
  host: "localhost",
  dialect: "mysql",
});
module.exports = sequelize;
