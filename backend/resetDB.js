const { Users, sequelize } = require("./models/"); // Import your models

const resetDatabase = async () => {
  try {
    // Sync the database, dropping all tables and recreating them
    await sequelize.sync({ alter: true }); // This will drop and recreate all tables
    console.log("All tables have been dropped and recreated successfully.");
  } catch (error) {
    console.error("Error resetting the database:", error);
  } finally {
    // Close the database connection
    await sequelize.close();
  }
};

// Run the reset function
resetDatabase();
