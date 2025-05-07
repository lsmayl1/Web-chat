import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { useMeQuery } from "../redux/services/api";
export const AuthRoute = () => {
  const {
    user,
    isLoading: userLoading,
    access_token,
  } = useSelector((state) => state.auth);
  const { isLoading } = useMeQuery(undefined, { skip: !access_token });

  if (isLoading) {
    return <Outlet />;
  }

  if (user && !userLoading) {
    return <Navigate to="/chat" replace />;
  }
  return <Outlet />;
};
