const { Users, Messages, Conversation } = require("../models/index");
const { Op } = require("sequelize");
const {
  getMessagesByConversationId,
} = require("../services/conversationService");

module.exports = (io, socket) => {
  socket.on("joinConversation", (conversationId) => {
    const room = `conversation_${conversationId}`;
    socket.join(room);
  });
  socket.on("getMessageHistory", async ({ conversationId }, callback) => {
    const messages = await getMessagesByConversationId(conversationId);
    if (!messages) {
      return callback({ success: false, message: "No messages found" });
    }

    callback({ success: true, messages: messages });
  });

  socket.on("sendMessage", async ({ receiverId, content }, callback) => {
    try {
      if (!receiverId || !content) {
        console.log("sendMessage error: receiverId or content is missing");
        return callback({
          success: false,
          message: "message is empty",
        });
      }
      const senderId = socket.user.id;
      console.log("Mesaj gönderiliyor:", { senderId, receiverId, content });

      const message = await Messages.create({
        senderId,
        receiverId,
        content,
        isRead: false,
      });

      io.to(`user:${receiverId}`).emit("receiveMessage", message);

      callback({ success: true, message });
    } catch (err) {
      console.error("sendMessage error:", err);
      callback({ success: false, message: "Server error" });
    }
  });
};
