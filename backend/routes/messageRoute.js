require("dotenv").config();
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const {
  sendMessage,
  createMessage,
  postMessageByConversationId,
} = require("../services/messageService");

router.post("/:conversation_id", async (req, res) => {
  const { id } = req.user;
  const { conversation_id } = req.params;
  const { content } = req.body;

  if (!conversation_id || !content) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const message = await postMessageByConversationId(
    conversation_id,
    content,
    id
  );

  res.status(201).json(message);
});

module.exports = router;
