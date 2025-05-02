import React from "react";
import { Sidebar } from "../Chat/Sidebar";
import { Outlet } from "react-router-dom";
export const Layout = () => {
  return (
    <div className="flex h-screen ">
      <Sidebar />
      <Outlet />
    </div>
  );
};
