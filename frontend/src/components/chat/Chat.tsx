import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import createSocket from "../../socket/socket";
import { ResponseMessageDto } from "../../types";
import { RootState } from "../../redux/store";
import { SendIcon } from "../../assets/SendIcon";
import { toast, ToastContainer } from "react-toastify";

export const Chat: React.FC = () => {
  const { id } = useParams();
  const { access_token: token, user } = useSelector(
    (state: RootState) => state.auth
  );
  const [data, setData] = useState<ResponseMessageDto | null>(null);
  const [socket, setSocket] = useState(null);
  const scrollRef = useRef(null);
  const [messageForm, setMessageForm] = useState({
    receiver_id: id,
    content: "",
    isRead: true,
  });
  const [socketError, setSocketError] = useState(null);
  // Get Messages
  useEffect(() => {
    if (token && id) {
      const newSocket = createSocket(token);
      setSocket(newSocket);
      newSocket.emit(
        "getMessagesWithUser",
        { receiverId: id },
        (response: ResponseMessageDto) => {
          if (response.success) {
            setData(response);
          } else {
            console.error("Mesajlar alınamadı:", response.message);
          }
        }
      );

      return () => {
        newSocket.disconnect();
      };
    }
  }, [token, id]);
  useEffect(() => {
    if (socket) {
      socket.on("receiveMessage", (message) => {
        console.log("Yeni mesaj alındı:", message);
        setData((prev) => ({
          ...prev,
          messages: [...prev.messages, message],
        }));
      });

      return () => {
        socket.off("receiveMessage");
      };
    }
  }, [socket]);

  const handleSendMessage = () => {
    if (socket && id) {
      socket.emit(
        "sendMessage",
        {
          receiverId: id,
          content: messageForm.content,
          isRead: true,
        },
        (response: ResponseMessageDto) => {
          if (response.success) {
            setData((prev: ResponseMessageDto | null) => ({
              ...prev,
              messages: [...prev?.messages, response?.message],
            }));

            setMessageForm((prev) => ({ ...prev, content: "" }));
          } else {
            setSocketError(response.message);
            console.error("Mesaj gönderilemedi:", response.message);
          }
        }
      );
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [data]);

  useEffect(() => {
    if (id) {
      setMessageForm({ receiver_id: id, content: "", isRead: true });
    }
  }, [id]);

  useEffect(() => {
    if (socketError) {
      toast.error(socketError);
    }
  }, [socketError]);

  return (
    <>
      <ToastContainer />
      {id ? (
        <div className="flex flex-col h-full flex-1 justify-end bg-secondaryBg">
          <div className="h-1/10  flex items-center px-4  bg-mainBg">
            <span className="text-2xl font-medium text-white ">
              {data?.user?.username}
            </span>
          </div>
          <div
            ref={scrollRef}
            className="flex-1  flex flex-col h-[60%] overflow-y-auto"
          >
            <ul className=" flex h-full flex-col gap-0 w-full">
              {data?.messages?.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.senderId === user?.user_id
                      ? "justify-end"
                      : "justify-start"
                  }  px-4`}
                >
                  <li className="flex flex-col gap-4 w-fit px-2 py-2 justify-end">
                    <div
                      className={`flex gap-4 flex-col  ${
                        message.senderId === user?.user_id
                          ? "bg-senderMessageBg"
                          : "bg-receiverMessageBg"
                      }  px-4 rounded-2xl py-2`}
                    >
                      <div className="flex justify-between  gap-12">
                        <p className="text-white text-xl">{message.content}</p>
                        <span className="text-white text-end items-end flex text-xs">
                          08:57
                        </span>
                      </div>
                    </div>
                  </li>
                </div>
              ))}
            </ul>
          </div>
          <div className="flex p-4 gap-4 bg-mainBg relative items-center">
            {" "}
            <input
              type="text"
              value={messageForm.content}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
              onChange={(e) =>
                setMessageForm((prev) => ({
                  ...prev,
                  content: e.target.value,
                  receiver_id: id,
                }))
              }
              placeholder="Your messages..."
              className="placeholder:text-md w-full px-4 py-2 rounded-xl text-xl bg-[#35373A] focus:outline-none text-white"
            />
            <button className="absolute right-6" onClick={() => handleSendMessage()}>
              <SendIcon className={"size-8 text-white"} />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-[#1B1B1B] flex-1 flex items-center justify-center text-white text-2xl ">
          Welcome to Web Chat
        </div>
      )}
    </>
  );
};
