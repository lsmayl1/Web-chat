import React, { useEffect, useState } from "react";
import { useGetConverstationsQuery } from "../../redux/services/api";
import { useNavigate, useParams } from "react-router-dom";
import { SearchIcon } from "../../assets/SearchIcon";
import { useSocket } from "../../hooks/useSocket";

type conversation = {
  conversation_id?: string;
  type?: string;
  title: string;
  last_message_content: string;
  participants: [
    {
      avatar?: string;
      username?: string;
      id?: string;
    }
  ];
};

export const Sidebar = () => {
  const { getMyConversations, updateMyConversations, socketRef } = useSocket();
  const { id } = useParams();
  const [conversations, setConversations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // İlk konuşmaları çek
    getMyConversations((res) => {
      if (res.success) {
        setConversations(res.conversations);
      }
    });
  }, []);

  useEffect(() => {
    const handleUpdate = (updatedData) => {
      // Backend tüm konuşma listesini gönderiyorsa direkt set
      if (Array.isArray(updatedData)) {
        setConversations(updatedData);
      } else {
        // Tek bir konuşma güncellendiyse, eski listeyi güncelle
        setConversations((prev) => {
          const index = prev.findIndex((c) => c.id === updatedData.id);
          if (index !== -1) {
            const updated = [...prev];
            updated[index] = { ...prev[index], ...updatedData };
            return updated;
          } else {
            return [...prev, updatedData];
          }
        });
      }
    };

    updateMyConversations(handleUpdate);

    // Temizlik
    return () => {
      socketRef.current?.off("updateMyConversations", handleUpdate);
    };
  }, []);

  return (
    <div
      className={`flex bg-mainBg w-1/4 h-full flex-col gap-4 py-4 max-md:w-full max-md:${
        id ? "hidden" : "block"
      }`}
    >
      <div className="px-4 flex relative items-center">
        <span className="absolute pl-2">
          <SearchIcon className={"text-[#96989C] size-6"} />
        </span>
        <input
          type="text"
          placeholder="Search"
          className="pl-10 w-full py-2  rounded-lg bg-[#35373B] text-white focus:outline-none"
        />
      </div>
      <ul className="flex flex-col ">
        {conversations?.map((conversation: conversation) => (
          <li
            key={conversation.conversation_id}
            onClick={() => navigate(`/chat/${conversation.conversation_id}`)}
            className={`w-full hover:bg-[#35373B]  cursor-pointer  flex flex-col  py-2 px-4 ${
              conversation.conversation_id === id && "bg-gray-600"
            }`}
          >
            <div className="flex w-full h-auto  py-2 items-center ">
              <div className="size-14 max-lg:size-10  overflow-hidden aspect-square rounded-full flex items-center justify-center">
                <img
                  src={`${import.meta.env.VITE_API_URL}/uploads/default.png`}
                  className="w-full h-full object-cover "
                  alt=""
                />
              </div>
              <div className="flex flex-1 flex-col gap-2 w-full px-4">
                <div className="flex justify-between items-center">
                  <span className="text-white text-lg">
                    {conversation.title}
                  </span>
                  <span className="text-sm text-gray-300">
                    {" "}
                    {new Date(
                      conversation.last_message_sent_at
                    ).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
                <div className="flex  w-full ">
                  <span className="text-gray-200">
                    {conversation.last_message_content}
                  </span>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
