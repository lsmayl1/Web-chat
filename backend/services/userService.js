const { Users, Op } = require("../models/index");
const bcrypt = require("bcryptjs");
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
        id: id,
      },
    });
    return user;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
};
const CreateUser = async (userData) => {
  if (!userData) {
    const error = new Error("User data is required");
    error.statusCode = 400;
    throw error;
  }
  if (
    !userData.first_name ||
    !userData.last_name ||
    !userData.username ||
    !userData.password ||
    !userData.email
  ) {
    const error = new Error("All fields are required");
    error.statusCode = 400;
    throw error;
  }
  try {
    const existingUser = await Users.findOne({
      where: {
        [Op.or]: [{ username: userData.username }, { email: userData.email }],
      },
    });
    if (existingUser) {
      const error = new Error("Username already exists");
      error.statusCode = 409;
      throw error;
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const userDataWithHashedPassword = {
      ...userData,
      password: hashedPassword,
    };
    const user = await Users.create(userDataWithHashedPassword);
    if (!user) {
      const error = new Error("User creation failed");
      error.statusCode = 500;
      throw error;
    }
    return user;
  } catch (error) {
    console.error("Error creating user:", error);
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    throw error;
  }
};
const DeleteUser = async (id) => {
  try {
    const user = await Users.destroy({
      where: {
        user_id: id,
      },
    });
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
    return user;
  } catch (error) {
    console.error("Error deleting user:", error);
    if (!error.statusCode) {
      error.statusCode = 500;
    }
    throw error;
  }
};

module.exports = {
  getById,
  getAllUsers,
  CreateUser,
  DeleteUser,
};
