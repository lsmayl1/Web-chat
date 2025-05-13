const {
  Users,
  Messages,
  Conversation,
  Conversations,
} = require("../models/index");
const { Op, where } = require("sequelize");
const { getConversationById } = require("../services/conversationService");
const { postMessageByConversationId } = require("../services/messageService");
const { getMyConversations } = require("../services/conversationService");
module.exports = (io, socket) => {
  socket.on("joinConversation", (conversationId) => {
    if (!conversationId) {
      console.log("joinConversation error: conversationId is missing");
      return;
    }
    console.log("User joined conversation:", conversationId);
    const room = `conversation_${conversationId}`;
    socket.join(room);
  });

  socket.on("getMyConversations", async (callback) => {
    const { id } = socket.user;
    if (!id) {
      console.log("getMyConversations error: user ID is missing");
      return callback({ success: false, message: "User ID is missing" });
    }

    const conversations = await getMyConversations(id);
    if (!conversations) {
      return callback({ success: false, message: "No conversations found" });
    }

    callback({ success: true, conversations });
  });

  socket.on("getConversation", async ({ conversation_id }, callback) => {
    const messages = await getConversationById({
      conversationId: conversation_id,
      receiverId: socket.user.id,
    });
    if (!messages) {
      return callback({ success: false, message: "No messages found" });
    }

    callback({ success: true, conversation: messages });
  });

  socket.on("sendMessage", async ({ conversation_id, content }, callback) => {
    try {
      if (!conversation_id || !content) {
        console.log("sendMessage error: conversation_id or content is missing");
        return callback({
          success: false,
          message: "message is empty",
        });
      }
      const senderId = socket.user.id;
      console.log("Sending message:", { conversation_id, content, senderId });

      const message = await postMessageByConversationId(
        conversation_id,
        content,
        senderId
      );

      if (!message) {
        console.log("sendMessage error: message not created");
        return callback({
          success: false,
          message: "message not created",
        });
      }

      const room = `conversation_${conversation_id}`;
      io.to(room).emit("receiveMessage", message);

      const updatedConversations = await getMyConversations(socket.user.id);
      if (updatedConversations) {
        io.to(room).emit("updateConversations", updatedConversations); 
      }

      callback({ success: true, message });
    } catch (err) {
      console.error("sendMessage error:", err);
      callback({ success: false, message: "Server error" });
    }
  });
};
