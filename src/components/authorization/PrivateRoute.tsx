import React, { ReactNode, ReactElement, useEffect } from "react";
import { Route, Navigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectAuth, setTokens } from "../../store/auth/auth.slice";
import { jwtDecode } from "jwt-decode";

interface PrivateRouteProps {
  children: ReactNode;
  path: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  path,
}): ReactElement | null => {
  const { isAuthenticated, accessToken, refreshToken } =
    useSelector(selectAuth);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const storedAccessToken = localStorage.getItem("accessToken");
    const storedRefreshToken = localStorage.getItem("refreshToken");

    if (storedAccessToken && storedRefreshToken) {
      try {
        const decodedAccessToken = jwtDecode(storedAccessToken) as {
          exp: number;
        } | null; // A decodificação pode falhar
        const decodedRefreshToken = jwtDecode(storedRefreshToken) as {
          exp: number;
        } | null;

        if (decodedAccessToken && decodedAccessToken.exp * 1000 > Date.now()) {
          // Access token is still valid
        } else if (
          decodedRefreshToken &&
          decodedRefreshToken.exp * 1000 > Date.now()
        ) {
          // Access token expired, but refresh token is valid
          dispatch(
            setTokens({
              accessToken: storedAccessToken,
              refreshToken: storedRefreshToken,
            })
          );
        } else {
          // Both tokens expired, clear them
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
      } catch (error) {
        // Invalid tokens, clear them
        console.error("Invalid token(s):", error);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    } else if (accessToken && refreshToken) {
      // If tokens are in Redux but not in localStorage, persist them (e.g., after a refresh)
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
    }
  }, [dispatch, accessToken, refreshToken]);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children as ReactElement;
};

export default PrivateRoute;
