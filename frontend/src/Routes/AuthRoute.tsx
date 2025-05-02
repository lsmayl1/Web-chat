import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

export const AuthRoute = () => {
  const { user, isLoading } = useSelector((state) => state.auth);



  if (user && !isLoading) {
    return <Navigate to="/chat" replace />;
  }
  return <Outlet />;
};
