const { validate: isValidUUID } = require("uuid");
const {
  Conversations,
  Conversations_participants,
  Messages,
  Users,
  Op,
} = require("../models");

const getAllConversations = async () => {
  try {
    const conversations = await Conversations.findAll({
      include: [
        {
          model: Users,
          as: "participants",
          attributes: ["id", "username", "avatar"],
          through: {
            model: Conversations_participants,
            as: "participants",
            attributes: [],
          },
        },
        {
          model: Messages,
          as: "messages",
          order: [["createdAt", "DESC"]],
        },
      ],
    });
    if (conversations.length == 0) {
      throw new Error("Conversatios Not Found");
    }

    return conversations;
  } catch (error) {
    console.log(error);
  }
};

const CreateConversation = async (users, type, title) => {
  if (!Array.isArray(users) || users.length === 0) {
    throw new Error("No users provided");
  }
  if (type === "private" && users.length > 2) {
    throw new Error("in private type you cant create users more than one");
  }
  if (type === "group" && title == null) {
    throw new Error("In group type title required");
  }
  let new_title;
  if (type === "private") {
    new_title = null;
  } else {
    new_title = title;
  }

  const userIds = users
    .filter((user) => user && user.id && isValidUUID(user.id))
    .map((user) => user.id);

  if (userIds.length !== users.length) {
    const invalidIds = users
      .filter((user) => !user || !user.id || !isValidUUID(user.id))
      .map((user) => user?.id || "undefined");
    throw new Error(
      `Invalid UUID format for user IDs: ${invalidIds.join(", ")}`
    );
  }
  const validUsers = await Users.findAll({
    where: {
      id: {
        [Op.in]: userIds,
      },
    },
    attributes: ["id", "username", "avatar"],
  });
  const validUserIdSet = new Set(validUsers.map((user) => user.id));
  const invalidUserIds = userIds.filter((id) => !validUserIdSet.has(id));

  if (invalidUserIds.length > 0) {
    throw new Error(
      `Invalid or non-existent user IDs: ${invalidUserIds.join(", ")}`
    );
  }

  try {
    const conversation = await Conversations.create({
      last_message_id: null,
      title: new_title,
      timestape: new Date(),
      type: type,
    });

    console.log(conversation);

    const participants = await Promise.all(
      validUsers.map(async (user) => {
        return await Conversations_participants.create({
          conversation_id: conversation.id,
          user_id: user.id,
          unread_count: 0,
          joined_at: new Date(),
        });
      })
    );
    if (!participants) {
      throw new Error("Failed to create participants.");
    }
    const response = {
      conversation_id: conversation.id,
      type: conversation.type,
      title: conversation.title,
      participants: participants.map((participant) => ({
        user_id: participant.id,
        unread_count: participant.unread_count,
        joined_at: participant.joined_at,
      })),
    };
    return response;
  } catch (error) {
    console.error("Error creating conversation:", error);
    throw error;
  }
};

const getConversationById = async ({ conversationId, receiverId }) => {
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
        },
        {
          model: Users,
          as: "participants",
          attributes: ["id", "username", "avatar"],
          through: {
            model: Conversations_participants,
            as: "participants",
            attributes: ["unread_count", "joined_at"],
          },
          where: {
            id: {
              [Op.ne]: receiverId, // Exclude the receiver from participants
            },
          },
        },
      ],
    });
    if (!conversation) {
      throw new Error("Conversation not found");
    }

    const response = {
      id: conversation.id,
      type: conversation.type,
      user: {
        id: conversation.participants[0].id,
        username: conversation.participants[0].username,
        avatar: conversation.participants[0].avatar,
      },
      messages: conversation.messages.map((message) => ({
        id: message.id,
        content: message.content,
        sent_at: message.sent_at,
        sender_id: message.sender_id,
      })),
    };

    return response;
  } catch (error) {
    console.error("Error fetching conversation by ID:", error);
    throw error;
  }
};

const getMyConversations = async (id) => {
  try {
    const conversations = await Conversations.findAll({
      include: [
        {
          model: Users,
          as: "participants",
          attributes: ["id", "username", "avatar"],
          through: {
            model: Conversations_participants,
            attributes: ["unread_count", "joined_at"], // Corrected typo: unread_count -> unread_count
          },
        },
        {
          model: Messages,
          as: "messages",
          attributes: ["id", "content", "sent_at", "sender_id"],
        },
      ],
      attributes: ["id", "type", "title", "last_message_id"],
    });

    if (conversations.length === 0) {
      throw new Error("No conversations found");
    }

    const filteredData = await Promise.all(
      conversations.map(async (conversation) => {
        const participants = conversation.participants.map((user) => ({
          user_id: user.id,
          username: user.username,
          avatar: user.avatar,
          unread_count: user.Conversations_participants.unread_count, // Corrected typo
          joined_at: user.Conversations_participants.joined_at,
        }));

        const currentUserParticipant = participants.find(
          (p) => p.user_id === id
        );
        const unread_count = currentUserParticipant
          ? currentUserParticipant.unread_count
          : 0;

        let title = conversation.title;
        let other_participant = null;
        if (conversation.type === "private") {
          other_participant =
            participants.find((p) => p.user_id !== id) || null;
          if (other_participant) {
            title = other_participant.username;
          }
        }

        const message = await Messages.findOne({
          where: {
            id: conversation.last_message_id,
          },
          order: [["createdAt", "DESC"]],
        });

        const baseData = {
          conversation_id: conversation.id,
          type: conversation.type,
          last_message_id: conversation.last_message_id || null,
          last_message_content: message ? message.content : null,
          last_message_sent_at: message ? message.sent_at : null,
        };

        if (conversation.type === "group") {
          return {
            ...baseData,
            title: conversation.title,
            participant_count: participants.length,
          };
        } else if (conversation.type === "private") {
          return {
            ...baseData,
            title,
            unread_count,
            other_participant: {
              user_id: other_participant?.user_id,
              username: other_participant?.username,
              avatar: other_participant?.avatar,
            },
          };
        }

        return baseData;
      })
    );

    return filteredData;
  } catch (error) {
    console.error("Error fetching conversations:", error);
    throw error.message || "Failed to fetch conversations";
  }
};

module.exports = {
  CreateConversation,
  getConversationById,
  getAllConversations,
  getMyConversations,
};
