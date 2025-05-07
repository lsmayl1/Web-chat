import { Sidebar } from "../chat/Sidebar";  
import { Outlet } from "react-router-dom";
import { useMeQuery } from "../../redux/services/api";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
export const Layout = () => {
  const {access_token:token} = useSelector((state:RootState)=>state.auth)
    const { isLoading } = useMeQuery(undefined, { skip: !token });
    if (isLoading) {
      return <Outlet />;
    }
  return (
    <div className="flex h-screen ">
      <Sidebar />
      <Outlet />
    </div>
  );
};
