const { DataTypes } = require("sequelize");
const sequelize = require("../database/db.js");

const Conversations_participants = sequelize.define(
  "Conversations_participants",
  {
    conversation_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    unread_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    joined_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "conversations_participants",
  },
  {
    timestamps: true,
  }
);

module.exports = Conversations_participants;
