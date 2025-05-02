const express = require("express");
const router = express.Router();
const { getById, getAllUsers } = require("../services/userService");
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
