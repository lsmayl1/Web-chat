const { Users, Messages } = require("../models/index");
const { Op } = require("sequelize");

module.exports = (io, socket) => {
  // MESAJ GÖNDERME
  socket.on("sendMessage", async ({ receiverId, content }, callback) => {
    try {
      if (!receiverId || !content) {
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

  // MESAJ GEÇMİŞİNİ GETİRME
  socket.on("getMessagesWithUser", async ({ receiverId }, callback) => {
    try {
      const senderId = socket.user.id;

      const user2 = await Users.findByPk(receiverId, {
        attributes: ["user_id", "username"],
      });

      if (!user2) {
        return callback({ success: false, message: "User not found" });
      }

      const messages = await Messages.findAll({
        where: {
          [Op.or]: [
            { senderId, receiverId },
            { senderId: receiverId, receiverId: senderId },
          ],
        },
        order: [["createdAt", "ASC"]],
        attributes: ["id", "senderId", "receiverId", "content", "createdAt"],
      });

      callback({
        success: true,
        user: user2,
        messages,
      });
    } catch (err) {
      console.error("getMessagesWithUser error:", err);
      callback({ success: false, message: "Server error" });
    }
  });
};
