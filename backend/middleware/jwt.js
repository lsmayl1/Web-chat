require("dotenv").config();
const jwt = require("jsonwebtoken");

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error_code: "MISSING_TOKEN",
      message: "Authorization header missing or not in Bearer format",
    });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      error_code: "INVALID_TOKEN",
      message: "Token is empty",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.user_id) {
      return res.status(401).json({
        error_code: "INVALID_TOKEN",
        message: "Invalid JWT token",
      });
    }
    req.user = { id: decoded.user_id };
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        error_code: "TOKEN_EXPIRED",
        message: "JWT token has expired",
      });
    }
    return res.status(401).json({
      error_code: "INVALID_TOKEN",
      message: "Invalid JWT token",
    });
  }
};

module.exports = authenticateJWT;
