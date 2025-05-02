require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const sequelize = require("./database/db");
const authRoute = require("./routes/authRoute");
const usersRoute = require("./routes/usersRoute");
const { Users, Messages } = require("./models/index");
const socketHandler = require("./socket");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

app.use("/auth", authRoute);
app.use("/users", usersRoute);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
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
