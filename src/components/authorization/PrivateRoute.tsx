import React, { ReactNode } from "react";
import { Navigate, RouteProps, useLocation } from "react-router-dom";

interface PrivateRouteProps extends Omit<RouteProps, "element"> {
  isAuthenticated: boolean;
  children: ReactNode; // Use ReactNode em vez de React.ReactNode para consistência
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  isAuthenticated,
  children,
  ...rest
}) => {
  const location = useLocation();

  return isAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/" state={{ from: location }} replace />
  );
};

export default PrivateRoute;
