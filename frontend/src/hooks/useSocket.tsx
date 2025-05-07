import  { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import createSocket from "../socket/socket";
import { RequestMessageDto, ResponseMessageDto } from "../types";
import  { Socket } from "socket.io-client";
import  { ClientToServerEvents, ServerToClientEvents } from "../SocketEvents";
export const useSocket = () => {
  const { access_token } = useSelector((state: RootState) => state.auth);
  const socketRef = useRef<typeof Socket<ServerToClientEvents, ClientToServerEvents> | null>(null);
  useEffect(() => {
    if (access_token) {
      const newSocket = createSocket(access_token);
      socketRef.current = newSocket;
      return () => {
        newSocket.disconnect();
        socketRef.current = null;
      };
    }
  }, [access_token]);

  const onSuccess = (callback: (data: any) => void) => {
    socketRef.current?.on("success", callback);
  };
  const onError = (callback: (data: any) => void) => {
    socketRef.current?.on("error", callback);
  };
  //Get messsages
  const GetMessages = (
    receiverId: string,
    callback: (messages: ResponseMessageDto[]) => void
  ) => {
    socketRef.current?.emit(
      "getMessagesWithUser",
      { receiverId },
      (response) => {
        if (response.success) {
          callback(response);
        } else {
          console.error("Messages not found");
        }
      }
    );
  };
  const SendMessage = (request, callback: (message:RequestMessageDto) => void) => {
    socketRef.current?.emit("sendMessage", request, (response) => {
      if (response.success) {
        callback(response.message);
      } else {
        console.log("Not sended");
      }
    });
  };
  const receiveMessage = (callback: (data:ResponseMessageDto) => void) => {
    socketRef.current?.on("receiveMessage", callback);
  };

  return { onSuccess, onError, GetMessages, SendMessage, receiveMessage };
};
