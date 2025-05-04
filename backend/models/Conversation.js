// models/conversation.js
const { DataTypes } = require("sequelize");
const sequelize = require("../database/db");
const Conversation = sequelize.define("Conversation", {
  userOneId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userTwoId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  lastMessage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Conversation;
