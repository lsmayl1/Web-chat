import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import createSocket from "../socket/socket";
import { RequestMessageDto, ResponseMessageDto } from "../types";
import { Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "../SocketEvents";

export const useSocket = () => {
  const { access_token } = useSelector((state: RootState) => state.auth);
  const socketRef = useRef(null);

  useEffect(() => {
    if (access_token) {
      const newSocket = createSocket(access_token);
      if (newSocket) {
        // newSocket.on('success', onSuccess);
        // newSocket.on('error', onError);
        socketRef.current = newSocket;
      }
      return () => {
        newSocket.disconnect();
        socketRef.current = null;
      };
    }
  }, [access_token]);

  //Get messsages
  const joinConversation = (
    conversationId: string,
    callback: (data: any) => void
  ) => {
    socketRef.current?.emit("joinConversation", conversationId, callback);
  };
  
  const getMyConversations = (callback: (data) => void) => {
    socketRef.current?.emit("getMyConversations", callback);
  };

  const updateMyConversations = (callback: (data) => void) => {
    socketRef.current?.on("updateConversations", callback);
  };

  const getConversation = (
    conversation_id: string,
    callback: (messages) => void
  ) => {
    socketRef.current?.emit(
      "getConversation",
      { conversation_id },
      (response) => {
        if (response.success) {
          callback(response);
        } else {
          console.error("Messages not found");
        }
      }
    );
  };

  const SendMessage = (request, callback: (message) => void) => {
    socketRef.current?.emit("sendMessage", request, (response) => {
      if (response.success) {
        callback(response.message);
      } else {
        console.log("Not sended");
      }
    });
  };

  const receiveMessage = (callback: (data) => void) => {
    socketRef.current?.on("receiveMessage", callback);
  };

  return {
    getConversation,
    SendMessage,
    receiveMessage,
    joinConversation,
    getMyConversations,
    updateMyConversations,
    socketRef,
  };
};
