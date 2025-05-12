const { sequelize } = require("./models/");

const resetDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("All tables have been dropped and recreated successfully.");
  } catch (error) {
    console.error("Error resetting the database:", error);
  } finally {
    await sequelize.close();
  }
};

resetDatabase();
