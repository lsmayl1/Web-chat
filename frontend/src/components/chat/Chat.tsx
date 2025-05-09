import { Outlet, useParams } from "react-router-dom";

export const Chat = () => {
  const { id } = useParams();

  return id ? (
    <Outlet />
  ) : (
    <div className="bg-[#1B1B1B] flex-1 flex items-center max-md:hidden justify-center text-white text-2xl ">
      Welcome to Web Chat
    </div>
  );
};
