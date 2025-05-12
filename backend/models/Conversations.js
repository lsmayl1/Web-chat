// models/conversation.js
const { DataTypes } = require("sequelize");
const sequelize = require("../database/db");
const Conversations = sequelize.define(
  "Conversations",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    last_message_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM("private", "group"),
      allowNull: false,
      defaultValue: "private",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Conversations;
