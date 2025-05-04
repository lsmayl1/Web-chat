require("dotenv").config();
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { sendMessage } = require("../services/messageService");
const { getMessagesByReceiverId } = require("../services/messageService");
const { Messages, Op, Users } = require("../models/index");
// router.get("/:chatId", async (req, res) => {
//   const chatId = req.params.chatId;
//   try {
//     const messages = await getMessagesByChatId(chatId);
//     res.status(200).json(messages);
//   } catch (error) {
//     console.error("Error fetching messages:", error);
//     res.status(500).json({ message: "Internal server error" });
//   }
// });

router.post("/", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }
  const { receiver_id, content, isRead } = req.body;
  try {
    const sender_id = jwt.verify(token, process.env.JWT_SECRET).userId;
    if (!sender_id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const message = await sendMessage({
      sender_id,
      receiver_id,
      content,
      isRead,
    });
    if (!message) {
      return res.status(400).json({ message: "Message sending failed" });
    }
    res.status(201).json(message);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:userId2", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Token missing or invalid" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId1 = decoded.userId;
    const userId2 = req.params.userId2;

    // userId2'nin bilgilerini al
    const user2 = await Users.findByPk(userId2, {
      attributes: ["user_id", "username"],
    });

    if (!user2) {
      return res.status(404).json({ message: "Receiver user not found." });
    }

    // Mesajları getir
    const messages = await Messages.findAll({
      where: {
        [Op.or]: [
          { senderId: userId1, receiverId: userId2 },
          { senderId: userId2, receiverId: userId1 },
        ],
      },
      order: [["createdAt", "ASC"]],
      attributes: ["id", "senderId", "receiverId", "content", "createdAt"],
    });

    res.status(200).json({
      senderUser: user2,
      messages,
    });
  } catch (error) {
    console.error("Mesajlar getirilirken hata:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
