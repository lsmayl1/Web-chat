const { response } = require("express");
const {
  Messages,
  Users,
  Conversations,
  Conversations_participants,
} = require("../models");

const postMessageByConversationId = async (
  conversation_id,
  content,
  sender_id
) => {
  console.log(conversation_id);
  try {
    if (!conversation_id || !content || !sender_id) {
      throw new Error("converstation id or content not found");
    }
    const validUser = await Conversations_participants.findOne({
      where: {
        conversation_id: conversation_id,
        user_id: sender_id,
      },
    });

    if (!validUser) {
      throw new Error("User is not a participant in the conversation");
    }
    const message = await Messages.create({
      conversation_id: conversation_id,
      content: content,
      sender_id: sender_id,
    });
    if (!message) {
      throw new Error("message cant creating");
    }
    await Conversations.update(
      { updatedAt: new Date(), last_message_id: message.id },
      {
        where: {
          id: conversation_id,
        },
      }
    );
    return message;
  } catch (error) {
    throw error;
  }
};

const getLastMessageContentByConversationId = async (id) => {
  try {
    const message = await Messages.findOne({
      where: {
        conversation_id: id,
      },
      order: [["createdAt", "DESC"]],
    });

    if (!message) {
      throw new Error("No messages found for the given conversation ID");
    }

    return message;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  postMessageByConversationId,
  getLastMessageContentByConversationId,
};
