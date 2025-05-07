import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { useMeQuery } from "../redux/services/api";
export const PrivateRoute = ({ allowedRoles }) => {
  const { user, access_token } = useSelector((state) => state.auth);
  const { isLoading, isError } = useMeQuery(undefined, { skip: !access_token });

  if (isLoading) {
    return <Outlet />;
  }

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
