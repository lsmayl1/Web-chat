const {
  Conversations,
  Conversations_participants,
  Messages,
  Users,
  Op,
} = require("../models");

const CreateConversation = async (users) => {
  if (!Array.isArray(users)) {
    throw new Error("Users must be a non-empty array.");
  }

  const validUsers = await Users.findAll({
    where: {
      id: {
        [Op.in]: users.map((user) => user.id),
      },
    },
  });

  if (!Array.isArray(validUsers)) {
    throw new Error("One or more users are invalid.");
  }

  try {
    const conversation = await Conversations.create({
      last_message_id: null,
      title: null,
      timestape: new Date(),
    });

    const participants = await Promise.all(
      validUsers.map(async (user) => {
        return await Conversations_participants.create({
          conversation_id: conversation.id,
          user_id: user.id,
          undread_count: 0,
          joined_at: new Date(),
        });
      })
    );
    if (!participants) {
      throw new Error("Failed to create participants.");
    }
    const response = {
      conversation_id: conversation.id,
      participants: participants.map((participant) => ({
        user_id: participant.user_id,
        undread_count: participant.undread_count,
        joined_at: participant.joined_at,
      })),
    };
    return response;
  } catch (error) {
    console.error("Error creating conversation:", error);
    throw error;
  }
};

const getConversationById = async ({ conversationId }) => {
  if (!conversationId) {
    throw new Error("Conversation ID is required");
  }
  try {
    const conversation = await Conversations.findOne({
      where: {
        id: conversationId,
      },
      include: [
        {
          model: Messages,
          as: "messages",
          order: [["createdAt", "DESC"]],
          limit: 1,
        },
        {
          model: Users,
          as: "participants",
          attributes: ["id", "username", "email"],
          through: {
            model: Conversations_participants,
            as: "participants",
            attributes: ["undread_count", "joined_at", "user_id"],
          },
        },
      ],
    });
    if (!conversation) {
      throw new Error("Conversation not found");
    }
    return conversation;
  } catch (error) {
    console.error("Error fetching conversation by ID:", error);
    throw error;
  }
};

module.exports = { CreateConversation, getConversationById };
