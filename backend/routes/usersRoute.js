require("dotenv").config();
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { getById, getAllUsers, CreateUser } = require("../services/userService");
const { Users, Op } = require("../models");
router.get("/", async (req, res) => {
  try {
    const users = await getAllUsers();
    if (!users) {
      return res.status(404).json({ message: "No users found" });
    }

    res.json(users);
  } catch (err) {
    console.log(err);
  }
});
router.post("/", async (req, res) => {
  const { first_name, last_name, username, password, email } = req.body;
  try {
    const user = await CreateUser({
      first_name,
      last_name,
      username,
      password,
      email,
    });
    res.status(201).json(user);
  } catch (error) {
    // Eğer hata özel bir statusCode içeriyorsa, onu kullan
    if (error.statusCode) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    // Eğer statusCode yoksa, genel bir hata döndür
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/withoutme", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const users = await Users.findAll({
      where: {
        user_id: { [Op.ne]: userId }, // Kullanıcının kendisi hariç tüm kullanıcıları getir
      },
    });
    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await getById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
