import React, { ReactNode, ReactElement, useEffect } from "react";
import { Route, Navigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectAuth } from "../../store/auth/auth.slice";
import { loginSuccess } from "../../store/auth/auth.slice"; // Importe sua action de login (ou similar)

interface PrivateRouteProps {
  children: ReactNode;
  path: string;
}

// Função para decodificar JWT (você pode usar uma biblioteca como 'jwt-decode')
const decodeJwt = (token: string) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  path,
}): ReactElement | null => {
  const { isAuthenticated } = useSelector(selectAuth);
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const storedToken = localStorage.getItem("accessToken"); // Ou sessionStorage

    if (storedToken) {
      const decodedToken = decodeJwt(storedToken);

      if (decodedToken && decodedToken.exp > Date.now() / 1000) {
        // Token é válido (verifique a expiração)
        // Assumindo que o payload do seu JWT contém informações do usuário
        dispatch(loginSuccess({ token: storedToken, user: decodedToken }));
      } else {
        // Token expirado ou inválido, limpe-o
        localStorage.removeItem("accessToken"); // Ou sessionStorage.removeItem
      }
    }
  }, [dispatch]);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children as ReactElement; // Force o tipo de children para ReactElement
};

export default PrivateRoute;
