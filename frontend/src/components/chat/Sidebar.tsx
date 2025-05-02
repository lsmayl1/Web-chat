import React from "react";

export const Sidebar = () => {
  const data = {
    name: "Ismayil",
    lastMessage: "Salam",
    date: "Today",
    unreadCount: 4,
    avatar:
      "data:image/png;base64,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",
  };
  return (
    <div className="flex bg-white w-1/5 border-r border-gray-300 h-full flex-col px-2 gap-4 py-4">
      <div>
        <input
          type="text"
          className="px-4 w-full py-2 border border-gray-300 rounded"
        />
      </div>
      <ul>
        <li className="w-full hover:bg-gray-200   flex flex-col rounded-xl py-2 px-2">
          <div className="flex w-full ">
            <div className="w-1/5 h-auto  overflow-hidden rounded-full">
              <img
                src={data.avatar}
                className="w-full h-full object-center"
                alt=""
              />
            </div>
            <div className="flex flex-col gap-2 w-full px-4">
              <div className="flex justify-between w-full items-center">
                <span className="text-xl">{data.name}</span>
                <span>{data.date}</span>
              </div>
              <div className="flex justify-between w-full items-center">
                <span className="">{data.lastMessage}</span>
                <span className="bg-blue-500 rounded-full px-2 text-white">
                  {data.unreadCount}
                </span>
              </div>
            </div>
          </div>
        </li>
        <li className="w-full hover:bg-gray-200   flex flex-col rounded-xl py-2 px-2 ">
          <div className="flex w-full ">
            <div className="w-1/5 h-auto  overflow-hidden rounded-full">
              <img
                src={data.avatar}
                className="w-full h-full object-center"
                alt=""
              />
            </div>
            <div className="flex flex-col gap-2 w-full px-4">
              <div className="flex justify-between w-full items-center">
                <span className="text-xl">{data.name}</span>
                <span>{data.date}</span>
              </div>
              <div className="flex justify-between w-full items-center">
                <span className="">{data.lastMessage}</span>
                <span className="bg-blue-500 rounded-full px-2 text-white">
                  {data.unreadCount}
                </span>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
};
