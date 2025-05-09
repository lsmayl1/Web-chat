const express = require("express");
const router = express.Router();
const { Op, Users, Messages, Conversations } = require("../models/index");
const {
  CreateConversation,
  getConversationById,
} = require("../services/conversationService");

router.post("/create", async (req, res) => {
  const { users } = req.body;
  const { id } = req.user;
  users.push({ id: id });
  console.log(users);

  if (!Array.isArray(users)) {
    return res.status(400).json({ error: "Users must be a non-empty array." });
  }
  const conversation = await CreateConversation(users);
  if (!conversation) {
    return res.status(500).json({ error: "Failed to create conversation." });
  }
  return res.status(201).json({
    conversation_id: conversation.conversation_id,
    participants: conversation.participants,
  });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const conversation = await getConversationById({ conversationId: id });
  if (!conversation) {
    return res.status(404).json({ error: "Conversation not found." });
  }

  res.status(200).json(conversation);
});
module.exports = router;
