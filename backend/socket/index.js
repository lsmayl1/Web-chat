const ChatSocket = require("./ChatSocket");
const jwt = require("jsonwebtoken");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("Bir kullanıcı bağlandı:", socket.id);

    const token = socket.handshake.auth?.token;
    if (!token) {
      console.log("Token yok. Bağlantı reddedildi.");
      socket.emit("error", { message: "Token yok." });
      return socket.disconnect(true);
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.user_id;

      if (!userId) {
        console.log("Geçersiz token içeriği.");
        socket.emit("error", { message: "Geçersiz token." });
        return socket.disconnect(true);
      }
      io.emit("success", { message: "Sockete baglandi" });
      socket.user = { id: userId };

      ChatSocket(io, socket);

      socket.on("disconnect", () => {
        console.log("Kullanıcı ayrıldı:", userId);
      });
    } catch (err) {
      console.error("Token doğrulama hatası:", err.message);
      return socket.disconnect(true);
    }
  });
};
