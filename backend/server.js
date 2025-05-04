require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const sequelize = require("./database/db");
const authRoute = require("./routes/authRoute");
const usersRoute = require("./routes/usersRoute");
const messageRoute = require("./routes/messageRoute");
const { Users, Messages } = require("./models/index");
const socketHandler = require("./socket");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use("/auth", authRoute);
app.use("/users", usersRoute);
app.use("/messages", messageRoute);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use((err, req, res, next) => {
  // Eğer hata özel bir statusCode içeriyorsa, onu kullan
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  res.status(statusCode).json({ message });
});

socketHandler(io);
sequelize
  .sync()
  .then(() => {
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database sync error:", error.message);
  });
