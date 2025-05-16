import axios from "axios";
import { Dispatch } from "redux";
import { logout } from "../store/auth/auth.slice"; // Importe a action de logout do slice

const API_URL = "http://localhost:9000/v1";

class AuthService {
  login = (username: string, password: string) => {
    return axios
      .post(API_URL + "/auth/login", { username, password })
      .then((response) => {
        if (response.data) {
          localStorage.setItem("accessToken", response.data.accessToken);
          localStorage.setItem("refreshToken", response.data.refreshToken);
          localStorage.setItem("userId", response.data.id);
          localStorage.setItem("nome", response.data.nome);
          localStorage.setItem("email", response.data.email);
          localStorage.setItem("username", response.data.username);
        }
        return response.data;
      });
  };

  logoutService = () => async (dispatch: Dispatch<any>) => {
    try {
      // Chamada para a API de "log off" no backend
      await axios.post(API_URL + "/auth/logout", {
        accessToken: localStorage.getItem("accessToken"), // Envie o token para invalidação
      });

      // Limpeza do estado local
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("nome");
      localStorage.removeItem("email");
      localStorage.removeItem("username");

      // Despacha a action de logout do Redux
      dispatch(logout());

      // Não precisamos lidar com o redirecionamento aqui.
      // O componente React será responsável por isso.
    } catch (error: any) {
      console.error("Erro ao fazer log off:", error);
      // Podemos despachar uma ação de falha aqui se quisermos
      // dispatch(logoutFailure(error.message || 'Erro ao fazer log off.'));
      throw error; // Propaga o erro para o componente lidar, se necessário
    }
  };

  register = (username: string, email: string, password: string) => {
    return axios.post(API_URL + "/register", {
      username,
      email,
      password,
    });
  };

  getCurrentUser = () => {
    return localStorage.getItem("userId") || null;
  };
}

export default new AuthService();
