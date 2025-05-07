// types/socketEvents.ts
import { RequestMessageDto, ResponseMessageDto } from "./types";

export interface ServerToClientEvents {
  success: (data: any) => void;
  error: (data: any) => void;
  receiveMessage: (data: ResponseMessageDto) => void;
}

export interface ClientToServerEvents {
  getMessagesWithUser: (
    data: { receiverId: string },
    callback: (response: { success: boolean; messages: ResponseMessageDto[] }) => void
  ) => void;
  sendMessage: (
    data: RequestMessageDto,
    callback: (response: { success: boolean; message: ResponseMessageDto }) => void
  ) => void;
}
