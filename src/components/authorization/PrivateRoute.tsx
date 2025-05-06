import React, { ReactNode, ReactElement } from "react";
import { Route, Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuth } from "../../store/auth.slice";

interface PrivateRouteProps {
  children: ReactNode;
  path: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  path,
}): ReactElement | null => {
  const { isAuthenticated } = useSelector(selectAuth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children as ReactElement; // Force o tipo de children para ReactElement
};

export default PrivateRoute;
