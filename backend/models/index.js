const { Sequelize, Op } = require("sequelize");
const sequelize = require("../database/db"); // Veritabanı bağlantısı

const Users = require("./Users");
const Messages = require("./Messages");
const Conversations = require("./Conversations");
const Conversations_participants = require("./Conversations_participants");

// Define relationships
Users.belongsToMany(Conversations, {
  through: Conversations_participants,
  foreignKey: "user_id",
  otherKey: "conversation_id",
  as: "conversations",
});

Conversations.belongsToMany(Users, {
  through: Conversations_participants,
  foreignKey: "conversation_id",
  otherKey: "user_id",
  as: "participants",
});

Conversations.hasMany(Messages, {
  foreignKey: "conversation_id",
  as: "messages",
});

Messages.belongsTo(Conversations, {
  foreignKey: "conversation_id",
  as: "conversation",
});

Conversations.belongsTo(Messages, {
  foreignKey: "last_message_id",
  as: "lastMessage",
  targetKey: "id", 
});

Users.hasMany(Messages, {
  foreignKey: "sender_id",
  as: "messages",
});

Messages.belongsTo(Users, {
  foreignKey: "sender_id",
  as: "sender",
});

module.exports = {
  sequelize,
  Sequelize,
  Messages,
  Users,
  Conversations_participants,
  Conversations,
  Op,
};
