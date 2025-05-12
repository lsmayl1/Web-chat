import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { NavLink, useParams } from "react-router-dom";
import { ResponseMessageDto } from "../../types";
import { RootState } from "../../redux/store";
import { SendIcon } from "../../assets/SendIcon";
import { toast, ToastContainer } from "react-toastify";
import { LeftArrow } from "../../assets/LeftArrow";
import { useSocket } from "../../hooks/useSocket";
import { useGetMessagesQuery } from "../../redux/services/api";
export const ChatList: React.FC = () => {
  const { id } = useParams();
  const { user } = useSelector((state: RootState) => state.auth);
  const [data, setData] = useState(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const {
    onSuccess,
    onError,
    SendMessage,
    receiveMessage,
    getConversation,
    joinConversation,
    getMyConversations,
  } = useSocket();

  const [messageForm, setMessageForm] = useState({
    receiver_id: id,
    content: "",
    isRead: true,
  });

  useEffect(() => {
    if (id) {
      joinConversation(id, (data) => {
        console.log(data);
      });
      getConversation(id, (data) => {
        setData(data);
      });
    }
  }, [id]);

  useEffect(() => {
    onError((error) => {
      toast.error(error?.message);
    });
  }, [onSuccess, onError, id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [data]);

  useEffect(() => {
    if (id) {
      receiveMessage((data) => {
        setData((prev) => {
          return {
            ...prev,
            conversation: {
              ...prev.conversation,
              messages: [...(prev.conversation?.messages || []), data],
            },
          };
        });
      });
      setMessageForm({ receiver_id: id, content: "", isRead: true });
    }
  }, [id]); // Include receiveMessage in the dependency array

  const handleSendMessage = () => {
    if (id) {
      SendMessage(
        { conversation_id: id, content: messageForm.content },
        (data) => {
          setMessageForm((prev) => ({ ...prev, content: "" }));
        }
      );
    }
  };

  return (
    <>
      <ToastContainer />
      <div
        className={`flex flex-col h-full max-md:h-[90%] flex-1 justify-end bg-secondaryBg ${
          !id && "max-md:hidden"
        } `}
      >
        <div className="h-1/12 max-md:h-1/16  flex items-center px-4 gap-4  bg-mainBg">
          <NavLink to={"/chat"} className={"md:hidden flex items-center "}>
            <LeftArrow className={"size-6"} />{" "}
          </NavLink>

          <div className="size-14 max-lg:size-10  overflow-hidden aspect-square rounded-full flex items-center justify-center">
            <img
              src={`${import.meta.env.VITE_API_URL}/uploads/default.png`}
              className="w-full h-full object-cover "
              alt=""
            />
          </div>
          <span className="text-2xl font-medium text-white ">
            {data?.conversation?.user?.username}
          </span>
        </div>
        <div
          ref={scrollRef}
          className="flex-1  flex flex-col h-[60%] overflow-y-auto"
        >
          <ul className=" flex h-full flex-col gap-0 w-full py-4">
            {data?.conversation?.messages?.length === 0 && (
              <span className="text-white">Messages not found</span>
            )}
            {data?.conversation?.messages?.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message?.sender_id === user?.id
                    ? "justify-end"
                    : "justify-start"
                }  px-1`}
              >
                <li className="flex flex-col  w-fit px-2 py-0.5 justify-end">
                  <div
                    className={`flex gap-2 flex-col  ${
                      message?.sender_id === user?.id
                        ? "bg-senderMessageBg"
                        : "bg-receiverMessageBg"
                    }  px-4 rounded-2xl py-2`}
                  >
                    <div className="flex justify-between  gap-12">
                      <p className="text-white text-xl max-md:text-md">
                        {message.content}
                      </p>
                      <span className="text-white text-end items-end flex text-xs">
                        {new Date(message?.sent_at).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </span>
                    </div>
                  </div>
                </li>
              </div>
            ))}
          </ul>
        </div>
        <div className="flex p-4 gap-4  relative items-center">
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
          <button
            className="absolute right-6"
            onClick={() => handleSendMessage()}
          >
            <SendIcon className={"size-8 text-white"} />
          </button>
        </div>
      </div>
    </>
  );
};
