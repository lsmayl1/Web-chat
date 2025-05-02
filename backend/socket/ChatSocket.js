const { getById } = require("../services/userService");
const { Users, Messages } = require("../models/index");

module.exports = (io, socket) => {
  // Identify user
  socket.on("identifyUser", async (userId) => {
    try {
      const user = await getById(userId);
      if (!user) {
        socket.emit("userNotFound", "User not found");
        return;
      }
      socket.user = user; // Store user object in socket
      socket.join(`user:${user.id}`); // Join user-specific room
      io.emit("userIdentified", { id: user.id, username: user.username });
      console.log("User identified:", user);
    } catch (error) {
      console.error("Error identifying user:", error);
      socket.emit("error", "An error occurred while identifying the user");
    }
  });

  // Handle sending messages
  socket.on(
    "sendMessage",
    async ({ content, receiverId, chatId }, callback) => {
      try {
        if (!socket.user) {
          throw new Error("User not identified");
        }

        // Save message to database
        const message = await Messages.create({
          content,
          senderId: socket.user.id,
          receiverId: receiverId || null,
          chatId: chatId || null,
          isRead: false,
        });

        // Fetch populated message with sender and receiver details
        const populatedMessage = await Messages.findOne({
          where: { id: message.id },
          include: [
            { model: Users, as: "sender", attributes: ["id", "username"] },
            { model: Users, as: "receiver", attributes: ["id", "username"] },
          ],
        });

        // Emit message to sender and receiver
        if (receiverId) {
          io.to(`user:${socket.user.id}`)
            .to(`user:${receiverId}`)
            .emit("receiveMessage", populatedMessage);
        } else {
          io.to(`user:${socket.user.id}`).emit(
            "receiveMessage",
            populatedMessage
          );
        }

        callback({ success: true, message: populatedMessage });
      } catch (error) {
        console.error("Error sending message:", error.message);
        callback({ success: false, message: error.message });
      }
    }
  );
};
