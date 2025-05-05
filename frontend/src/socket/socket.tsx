// socket.js
import { io } from "socket.io-client";

const ENDPOINT =import.meta.env.VITE_API_URL

const createSocket = (token: string) => {
  return io(ENDPOINT, {
    auth: {
      token: token,
    },
  });
};

export default createSocket;
