const express = require("express");
const router = express.Router();
const { Op, Users, Messages, Conversations } = require("../models/index");
const {
  CreateConversation,
  getConversationById,
  getAllConversations,
  getMyConversations,
} = require("../services/conversationService");

router.get("/", async (req, res) => {
  const conversations = await getAllConversations();
  res.status(200).json({ conversations });
});

router.get("/my", async (req, res) => {
  const { id } = req.user;
  const conversation = await getMyConversations(id);
  res.status(200).json(conversation);
});

router.post("/create", async (req, res) => {
  const { users, type, title } = req.body;
  const { id } = req.user;
  users.push({ id: id });
  console.log(users);

  if (!Array.isArray(users)) {
    return res.status(400).json({ error: "Users must be a non-empty array." });
  }
  const conversation = await CreateConversation(users, type, title);
  if (!conversation) {
    return res.status(500).json({ error: "Failed to create conversation." });
  }
  return res.status(201).json({
    conversation_id: conversation.conversation_id,
    participants: conversation.participants,
    type: conversation.type,
    title: conversation.title,
  });
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { id: user_id } = req.user;

    const conversation = await getConversationById({
      conversationId: id,
      receiverId: user_id,
    });
    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found." });
    }

    res.status(200).json(conversation);
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

module.exports = router;
