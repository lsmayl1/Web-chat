import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
export const PrivateRoute = ({ allowedRoles }) => {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to={"/sign-in"} />;
  }
  const hasRequiredRole = Array.isArray(allowedRoles)
    ? allowedRoles.includes(user?.role)
    : allowedRoles === user?.role;

  if (!hasRequiredRole) {
    return <Navigate to={"sign-in"} replace />;
  }

  return <Outlet />;
};
