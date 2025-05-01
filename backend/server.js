const express = require("express");
const cors = require("cors");
const sequelize = require("./database/db");
const app = express();
require("dotenv").config();
app.use(cors());
const authRoute = require("./routes/authRoute");

app.use(express.json());
app.use("/auth", authRoute);

sequelize.sync().then(() => {
  app.listen(process.env.PORT, "0.0.0.0", () => {
    console.log(
      `Server is running on http://localhost:${process.env.PORT || 3000}`
    );
  });
});
