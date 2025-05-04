const { Sequelize, Op } = require("sequelize");
const sequelize = require("../database/db"); // Veritabanı bağlantısı
const Users = require("./Users");
const Messages = require("./Messages");
const Conversation = require("./Conversation");

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

// Conversation.belongsTo(Users, {
//   foreignKey: "userOneId",
//   as: "userOne",
// });

// Conversation.belongsTo(Users, {
//   foreignKey: "userTwoId",
//   as: "userTwo",
// });


// Conversation.belongsTo(Messages, {
//   foreignKey: "lastMessage",
//   as: "lastMessageDetails",
// });

module.exports = {
  sequelize,
  Sequelize,
  Messages,
  Users,
  Conversation,
  Op,
};
