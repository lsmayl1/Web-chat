const ChatSocket = require("./ChatSocket");
const jwt = require("jsonwebtoken");
module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("Bir kullanıcı bağlandı:", socket.id);
    const token = socket.handshake.auth.token;
    if (!token) {
      console.log("Token bulunamadı. Bağlantı reddedildi.");
      socket.disconnect();
      return;
    }
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded) {
        console.log("Token geçersiz. Bağlantı reddedildi.");
        socket.disconnect();
        return;
      }
      console.log(decoded);
      socket.user = decoded; // Kullanıcı kimliğini sakla
      console.log("Kullanıcı kimliği:", socket.user.userId);
    } catch (error) {
      console.error("Token doğrulama hatası:", error.message);
      socket.emit("error", "Token doğrulama hatası");
      socket.disconnect();
      return;
    }
    console.log("Kullanıcı doğrulandı:", socket.user.userId);
    socket.user = decoded; // İleride ChatSocket içinde kullanacağız

    ChatSocket(io, socket);

    socket.on("disconnect", () => {
      console.log("Kullanıcı ayrıldı:", socket.id);
    });
  });
};
