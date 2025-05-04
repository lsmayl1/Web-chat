// socket.js
import { io } from "socket.io-client";

const ENDPOINT = "http://192.168.1.67:3000";

const createSocket = (token) => {
  return io(ENDPOINT, {
    auth: {
      token: token,
    },
  });
};

export default createSocket;
