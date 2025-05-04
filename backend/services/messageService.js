const { Messages, Users } = require("../models");

const sendMessage = async ({ sender_id, receiver_id, content, isRead }) => {
  if (!sender_id || !receiver_id || !content || !isRead) {
    const error = new Error(
      "All fields are required" + sender_id + receiver_id + content + isRead
    );

    error.statusCode = 400;
    throw error;
  }
  try {
    ``;
    const messageData = {
      senderId: sender_id,
      receiverId: receiver_id,
      content,
      isRead,
    };
    const message = await Messages.create(messageData);
    return message;
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

const getMessagesByReceiverId = async ({ receiver_id, sender_id }) => {
  if (!receiver_id || !sender_id) {
    const error = new Error("Receiver ID is required");
    error.statusCode = 400;
    throw error;
  }
  try {
    const messages = await Messages.findAll({
      where: {
        receiverId: receiver_id,
        senderId: sender_id,
      },
    });

    if (!messages) {
      return res.status(404).json({ message: "No messages found" });
    }
    return messages;
  } catch (error) {
    console.error("Error fetching messages by receiver ID:", error);
    throw error;
  }
};

const getMessagesByChatId = async (chatId) => {
  if (!chatId) {
    const error = new Error("Chat ID is required");
    error.statusCode = 400;
    throw error;
  }
  try {
    const messages = await Messages.findAll({
      where: {
        chat_id: chatId,
      },
      include: [
        {
          model: Users,
          as: "sender",
          attributes: ["id", "username"],
        },
        {
          model: Users,
          as: "receiver",
          attributes: ["id", "username"],
        },
      ],
    });
    return messages;
  } catch (error) {
    console.error("Error fetching messages by chat ID:", error);
    throw error;
  }
};

module.exports = {
  sendMessage,
  getMessagesByChatId,
  getMessagesByReceiverId,
};
