const ChatSocket = require("./ChatSocket");
const jwt = require("jsonwebtoken");

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("Bir kullanıcı bağlandı:", socket.id);

    const token = socket.handshake.auth?.token;
    if (!token) {
      console.log("Token yok. Bağlantı reddedildi.");
      return socket.disconnect(true);
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.userId;

      if (!userId) {
        console.log("Geçersiz token içeriği.");
        return socket.disconnect(true);
      }

      socket.user = { id: userId };

      // Kendi user room'una katılır
      const roomName = `user:${userId}`;
      socket.join(roomName);

      console.log("Kullanıcı doğrulandı. Odaya katıldı:", roomName);

      // Chat olaylarını dinle
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
