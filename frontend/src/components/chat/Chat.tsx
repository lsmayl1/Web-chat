import { useSelector } from "react-redux";
import { Outlet, useParams } from "react-router-dom";
import { RootState } from "../../redux/store";

export const Chat = () => {
  const { id } = useParams();
  const { user } = useSelector((state: RootState) => state.auth);

  return id ? (
    <Outlet />
  ) : (
    <div className="bg-[#1B1B1B] flex-1 flex items-center max-md:hidden justify-center text-white text-2xl ">
      Welcome to Web Chat {user?.username}
    </div>
  );
};
