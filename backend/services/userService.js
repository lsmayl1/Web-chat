const { Users } = require("../models/index");

const getAllUsers = async () => {
  try {
    const users = await Users.findAll();
    return users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

const getById = async (id) => {
  try {
    const user = await Users.findOne({
      where: {
        user_id: id,
      },
    });
    return user;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
};
module.exports = {
  getById,
  getAllUsers,
};
