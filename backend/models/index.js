const { Sequelize, Op } = require("sequelize");
const sequelize = require("../database/db"); // Veritabanı bağlantısı
const Users = require("./Users");
const Messages = require("./Messages");

Users.hasMany(Messages, {
  foreignKey: "senderId",
  as: "sentMessages",
});
Users.hasMany(Messages, {
  foreignKey: "receiverId",
  as: "receivedMessages",
});

Messages.belongsTo(Users, {
  foreignKey: "senderId",
  as: "sender",
});
Messages.belongsTo(Users, {
  foreignKey: "receiverId",
  as: "receiver",
});

module.exports = {
  sequelize,
  Sequelize,
  Messages,
  Users,
  Op,
};
